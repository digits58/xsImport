//// ExposureSheetImport.jsx

/// Imports Footage with the Toei Digital Timesheet file format v7 (*.xdts)

// Author: 58 <digits58 at gmail dot com>
// Special Thanks: GreenBlueClouds <https://greenblueclouds.tumblr.com>
// Changelog:
//     v0.0.1 - 2022/09/22: Initial release
//
//     v0.0.2 - 2022/11/01:
//     Cells imported into their own folder, scan images for
//     resolutions and select at the end, fix composition pixel
//     aspect ratio, fix imports with no cells or only null cell
//
//     v0.0.3 - 2022/11/02:
//     v0.0.4 - 2023/01/12:
//     Fixed a bug with missing folders and ignore desktop.ini
//
//     v0.0.5 - 2023/07/21:
//     Default to numeric image filename importing and add option to force
//     alphabetical
//
//     v0.0.6 - 2024/01/19:
//     Fix bug with reading xdts files on Japanese locales due to SJIS
//
//     v0.0.7 - 2024/01/20:
//     Include json2.js for versions of After Effects without it
//
//     v0.0.8 - 2024/03/29:
//     Fix bug for sequence of frames that does not start with one
//     Note the Time Remap numbers will not align with the exported
//     frame number
//
//     v0.0.9 - 2024/04/26:
//     Add new feature to allow renaming the timeline for import as
//

// MIT License
//
// Copyright (c) 2024, 58 <digits58 at gmail dot com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var VERSION = "0.0.9";
var LAST_COMMIT = "80172a8";
var COMMIT_DATE = "2024/04/29";

////////////////////////////////////////////////////////////////////////////////
//  json2.js - imported library
//
//  URL: https://github.com/douglascrockford/JSON-js
//  Commit: 7e83f38
//  Date: 2023-05-10
//

//  The following creates a global JSON object containing two methods:
//  stringify and parse. This provides the ES5 JSON capability to ES3
//  systems. If a project might run on IE8 or earlier, then this
//  should be included.  The following does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(
//                         +a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]
//                      ));
//                  }
//                  return value;
//              }
//          });

//          myData = JSON.parse(
//              "[\"Date(09/09/2001)\"]",
//              function (key, value) {
//                  var d;
//                  if (
//                      typeof value === "string"
//                      && value.slice(0, 5) === "Date("
//                      && value.slice(-1) === ")"
//                  ) {
//                      d = new Date(value.slice(5, -1));
//                      if (d) {
//                          return d;
//                      }
//                  }
//                  return value;
//              }
//          );

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== "object") {
  JSON = {};
}

(function () {
  "use strict";

  var rx_one = /^[\],:{}\s]*$/;
  var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
  var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
  var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

  function f(n) {
    // Format integers to have at least two digits.
    return (n < 10)
      ? "0" + n
      : n;
  }

  function this_value() {
    return this.valueOf();
  }

  if (typeof Date.prototype.toJSON !== "function") {

    Date.prototype.toJSON = function () {

      return isFinite(this.valueOf())
        ? (
          this.getUTCFullYear()
          + "-"
          + f(this.getUTCMonth() + 1)
          + "-"
          + f(this.getUTCDate())
          + "T"
          + f(this.getUTCHours())
          + ":"
          + f(this.getUTCMinutes())
          + ":"
          + f(this.getUTCSeconds())
          + "Z"
        )
        : null;
    };

    Boolean.prototype.toJSON = this_value;
    Number.prototype.toJSON = this_value;
    String.prototype.toJSON = this_value;
  }

  var gap;
  var indent;
  var meta;
  var rep;


  function quote(string) {

    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.

    rx_escapable.lastIndex = 0;
    return rx_escapable.test(string)
      ? "\"" + string.replace(rx_escapable, function (a) {
        var c = meta[a];
        return typeof c === "string"
          ? c
          : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
      }) + "\""
      : "\"" + string + "\"";
  }


  function str(key, holder) {

    // Produce a string from holder[key].

    var i;          // The loop counter.
    var k;          // The member key.
    var v;          // The member value.
    var length;
    var mind = gap;
    var partial;
    var value = holder[key];

    // If the value has a toJSON method, call it to obtain a replacement value.

    if (
      value
      && typeof value === "object"
      && typeof value.toJSON === "function"
    ) {
      value = value.toJSON(key);
    }

    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.

    if (typeof rep === "function") {
      value = rep.call(holder, key, value);
    }

    // What happens next depends on the value's type.

    switch (typeof value) {
      case "string":
        return quote(value);

      case "number":

        // JSON numbers must be finite. Encode non-finite numbers as null.

        return (isFinite(value))
          ? String(value)
          : "null";

      case "boolean":
      case "null":

        // If the value is a boolean or null, convert it to a string. Note:
        // typeof null does not produce "null". The case is included here in
        // the remote chance that this gets fixed someday.

        return String(value);

      // If the type is "object", we might be dealing with an object or an array or
      // null.

      case "object":

        // Due to a specification blunder in ECMAScript, typeof null is "object",
        // so watch out for that case.

        if (!value) {
          return "null";
        }

        // Make an array to hold the partial results of stringifying this object value.

        gap += indent;
        partial = [];

        // Is the value an array?

        if (Object.prototype.toString.apply(value) === "[object Array]") {

          // The value is an array. Stringify every element. Use null as a placeholder
          // for non-JSON values.

          length = value.length;
          for (i = 0; i < length; i += 1) {
            partial[i] = str(i, value) || "null";
          }

          // Join all of the elements together, separated with commas, and wrap them in
          // brackets.

          v = partial.length === 0
            ? "[]"
            : gap
              ? (
                "[\n"
                + gap
                + partial.join(",\n" + gap)
                + "\n"
                + mind
                + "]"
              )
              : "[" + partial.join(",") + "]";
          gap = mind;
          return v;
        }

        // If the replacer is an array, use it to select the members to be stringified.

        if (rep && typeof rep === "object") {
          length = rep.length;
          for (i = 0; i < length; i += 1) {
            if (typeof rep[i] === "string") {
              k = rep[i];
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (
                  (gap)
                    ? ": "
                    : ":"
                ) + v);
              }
            }
          }
        } else {

          // Otherwise, iterate through all of the keys in the object.

          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (
                  (gap)
                    ? ": "
                    : ":"
                ) + v);
              }
            }
          }
        }

        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.

        v = partial.length === 0
          ? "{}"
          : gap
            ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
            : "{" + partial.join(",") + "}";
        gap = mind;
        return v;
    }
  }

  // If the JSON object does not yet have a stringify method, give it one.

  if (typeof JSON.stringify !== "function") {
    meta = {    // table of character substitutions
      "\b": "\\b",
      "\t": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      "\"": "\\\"",
      "\\": "\\\\"
    };
    JSON.stringify = function (value, replacer, space) {

      // The stringify method takes a value and an optional replacer, and an optional
      // space parameter, and returns a JSON text. The replacer can be a function
      // that can replace values, or an array of strings that will select the keys.
      // A default replacer method can be provided. Use of the space parameter can
      // produce text that is more easily readable.

      var i;
      gap = "";
      indent = "";

      // If the space parameter is a number, make an indent string containing that
      // many spaces.

      if (typeof space === "number") {
        for (i = 0; i < space; i += 1) {
          indent += " ";
        }

        // If the space parameter is a string, it will be used as the indent string.

      } else if (typeof space === "string") {
        indent = space;
      }

      // If there is a replacer, it must be a function or an array.
      // Otherwise, throw an error.

      rep = replacer;
      if (replacer && typeof replacer !== "function" && (
        typeof replacer !== "object"
        || typeof replacer.length !== "number"
      )) {
        throw new Error("JSON.stringify");
      }

      // Make a fake root object containing our value under the key of "".
      // Return the result of stringifying the value.

      return str("", { "": value });
    };
  }


  // If the JSON object does not yet have a parse method, give it one.

  if (typeof JSON.parse !== "function") {
    JSON.parse = function (text, reviver) {

      // The parse method takes a text and an optional reviver function, and returns
      // a JavaScript value if the text is a valid JSON text.

      var j;

      function walk(holder, key) {

        // The walk method is used to recursively walk the resulting structure so
        // that modifications can be made.

        var k;
        var v;
        var value = holder[key];
        if (value && typeof value === "object") {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (v !== undefined) {
                value[k] = v;
              } else {
                delete value[k];
              }
            }
          }
        }
        return reviver.call(holder, key, value);
      }


      // Parsing happens in four stages. In the first stage, we replace certain
      // Unicode characters with escape sequences. JavaScript handles many characters
      // incorrectly, either silently deleting them, or treating them as line endings.

      text = String(text);
      rx_dangerous.lastIndex = 0;
      if (rx_dangerous.test(text)) {
        text = text.replace(rx_dangerous, function (a) {
          return (
            "\\u"
            + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
          );
        });
      }

      // In the second stage, we run the text against regular expressions that look
      // for non-JSON patterns. We are especially concerned with "()" and "new"
      // because they can cause invocation, and "=" because it can cause mutation.
      // But just to be safe, we want to reject all unexpected forms.

      // We split the second stage into 4 regexp operations in order to work around
      // crippling inefficiencies in IE's and Safari's regexp engines. First we
      // replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
      // replace all simple value tokens with "]" characters. Third, we delete all
      // open brackets that follow a colon or comma or that begin the text. Finally,
      // we look to see that the remaining characters are only whitespace or "]" or
      // "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

      if (
        rx_one.test(
          text
            .replace(rx_two, "@")
            .replace(rx_three, "]")
            .replace(rx_four, "")
        )
      ) {

        // In the third stage we use the eval function to compile the text into a
        // JavaScript structure. The "{" operator is subject to a syntactic ambiguity
        // in JavaScript: it can begin a block or an object literal. We wrap the text
        // in parens to eliminate the ambiguity.

        j = eval("(" + text + ")");

        // In the optional fourth stage, we recursively walk the new structure, passing
        // each name/value pair to a reviver function for possible transformation.

        return (typeof reviver === "function")
          ? walk({ "": j }, "")
          : j;
      }

      // If the text is not JSON parseable, then a SyntaxError is thrown.

      throw new SyntaxError("JSON.parse");
    };
  }
}());
// json2.js
////////////////////////////////////////////////////////////////////////////////
{
  // ExtendScript implements the JavaScript language according to the ECMA-262
  // specification. The After Effects scripting engine supports the 3rd Edition
  // of the ECMA-262 Standard, including its notational and lexical conventions,
  // types, objects, expressions, and statements. ExtendScript also implements
  // the E4X ECMA-357 specification, which defines access to data in XML format.
  //
  //  https://ae-scripting.docsforadobe.dev/introduction/overview.html
  //  https://extendscript.docsforadobe.dev/index.html
  //  https://www.ecma-international.org/publications-and-standards/standards/ecma-262/
  //
  // We loosely implement a few missing features >ES3

  function IsCallable(argument) {
    if (argument.call != undefined) return true;
    return false;
  }
  Array.prototype.forEach = function (callbackfn) {
    if (!IsCallable(callbackfn)) throw TypeError;
    for (var k = 0; k < this.length; k++) {
      callbackfn(this[k], k, this);
    }
    return undefined;
  };
  /**
   * Returns first element in the array the predicate matches
   * @param {function} predicate function(element[idx], idx, elementArray)
   * @returns {element | undefined} element found or the
   */
  Array.prototype.find = function (predicate) {
    if (!IsCallable(predicate)) throw TypeError;
    for (var k = 0; k < this.length; k++) {
      if (predicate(this[k], k, this)) return this[k];
    }
    return undefined;
  };

  function createDockableUI(thisObj) {
    var dialog =
      thisObj instanceof Panel
        ? thisObj
        : new Window("window", undefined, undefined, { resizeable: true });
    dialog.onResizing = dialog.onResize = function () {
      this.layout.resize();
    };
    return dialog;
  }

  function showWindow(myWindow) {
    if (myWindow instanceof Window) {
      myWindow.center();
      myWindow.show();
    }
    if (myWindow instanceof Panel) {
      myWindow.layout.layout(true);
      myWindow.layout.resize();
    }
  }

  var imgString = "%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%000%00%00%000%08%06%00%00%00W%02%C3%B9%C2%87%00%00%00%09pHYs%00%00%0B%13%00%00%0B%13%01%00%C2%9A%C2%9C%18%00%00%01%C3%90IDATh%C2%81%C3%AD%C2%991r%C3%83%20%10E%C2%BF2%3E%C2%87%0B%5D%C2%8D%C3%86%C2%ADk%C3%95%C2%AA%C3%9D%C2%BA%C3%A1j.%7C%11%C2%A5%01%0D%10%40%2C%C2%BBkE%C2%89%C3%9E%C2%8Cg%1C%C2%8F%16%C3%BE%C3%9F%C2%95%16A%C2%80%C2%93%C2%93%5DYv%C2%8E%C3%87%17grc%0CG%047%1E%0000'%07%00Xk%C2%A9cq%C3%A3W8%15X!f2%12%C3%8F%C2%A5%C3%87uQ%40C%269%C2%B1YD*%C3%A0%C3%99%C2%A8%C2%84h%C3%A6%3D%C2%A9%C2%81%C2%A5%22%C2%A0%C2%89%C3%80D%C3%B4%11%10%C2%9F%C3%95v%09%2Fx%C3%9F%C3%AE%00%C2%80%C3%AB%C3%B3%C3%A1%2F%C3%ACz%C2%B0%C2%843%C2%BD%00%40%C2%A2m%C3%95u%C3%89EH%19a%12%09%2F%11%0A%5BJ%17_%C2%9F%C2%8F%C3%B5%C2%BB%C3%86%7D%C3%ACq%0F2%C2%80%C2%B2p%C2%A7%C2%A5%5E%C2%81%C2%94%C2%A0%22%0Cymle%3CE%C2%B4%0B%C3%AD%C3%81%C3%A1%0D4%C3%9DB%25%C2%A6i%C2%8A%C3%BE%C2%9E%C3%A7Y%25%C2%A6%C3%86%C3%A1%2B%C2%90%C2%B6%C3%87j'%C3%B2%1D(%C3%8C%C3%A28%C2%8E%00%C2%80%C3%97%C3%AB%C2%B5%C3%BE%C2%96%C3%8Bjk%C2%8C%C2%B5%C2%B6%C2%B9%03%01%3F%2B0%7C%C2%A2%C3%93%C3%B4%C2%90%13%0F%C3%A4o%C2%A1_g%C2%A2%24%1E(%3F%03%C2%91%C2%89%C3%B0%C3%B6%C3%91%C3%86%18%C2%83tnT%C3%9E%04j%0F%C3%B1%C3%AE%C2%95%C3%98%12%0Flw%C2%A1%C3%A1%C2%93%C3%99%C3%B7%04U%C3%98%7C%07c%C2%AD%03%40%C3%9CI4cJ%C2%B4%C2%BCe%16%C3%9F%C3%A55%17%C2%B2%C3%96%1D%C3%9A%C2%9F%5B%C3%88J%C2%A8l%07KP%C3%B6%C3%87%C3%9DG!ZP7%C3%B7%C3%94%C2%9D%C2%96%C2%AA%C2%89%C2%9E%C2%93%09%C2%B2%01%C3%BFE%C3%92H%C2%B8%13%03Q%13%C2%B9%C2%8D%C2%A6%C2%BB3%C2%8E%11%2F%C2%9C%C2%B3%C3%A3%C3%AB%5E%078FR%C3%A1%1C%C2%BAN%C3%A6r%13S%C2%B2W%C2%89'%C3%AB%C3%A9%3E%C3%9C%C2%95%C3%88%C2%9E%C2%A7W%7Cw%C2%90C%C3%84%04G%3C%2B%C3%90%C3%812%C3%81%15%C3%8F%0Evt%C2%99%C2%90%10%2F2%C2%80%C2%83dBJ%C2%BC%C3%98%20%C2%8E%26%13%C2%92%C3%A2E%07rTMH%C2%8B%17%1F%C3%8CQ%5B'%C3%84%C3%A7%C3%93%3A6%C2%8FLh%C2%89%C3%97fy%C3%9F%C3%AE%C3%AC%C3%BF%C3%B8%C3%AC%C3%8D%C2%A1%C3%85%C2%9F%C3%BC%0B%C2%BE%01b%3B%C3%9D%C2%ABs%15%18%C3%81%00%00%00%00IEND%C2%AEB%60%C2%82";
  var img = File.decode(imgString);
  function createMainWindow(thisObj) {
    /*
    Code for Import https://scriptui.joonas.me — (Triple click to select):
    {"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":"mainWindow","windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"XdtsImport","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["fill","top"]}},"item-2":{"id":2,"type":"Group","parentId":28,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["center","center"],"alignment":null}},"item-3":{"id":3,"type":"Button","parentId":2,"style":{"enabled":false,"varName":"importBtn","text":"Import","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-4":{"id":4,"type":"Button","parentId":2,"style":{"enabled":true,"varName":"cancelBtn","text":"Cancel","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-5":{"id":5,"type":"Divider","parentId":28,"style":{"enabled":true,"varName":null}},"item-8":{"id":8,"type":"DropDownList","parentId":28,"style":{"enabled":false,"varName":"timelineList","text":"DropDownList","listItems":"Timeline","preferredSize":[0,0],"alignment":"fill","selection":0,"helpTip":null}},"item-9":{"id":9,"type":"Button","parentId":28,"style":{"enabled":true,"varName":"openBtn","text":"Open XDTS","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-23":{"id":23,"type":"Image","parentId":25,"style":{"enabled":true,"varName":"logoImage","image":[""],"alignment":null,"helpTip":""}},"item-25":{"id":25,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"aboutPanel","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"About","preferredSize":[0,0],"margins":5,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-27":{"id":27,"type":"StaticText","parentId":25,"style":{"enabled":true,"varName":"versionText","creationProps":{},"softWrap":false,"text":"version: 0.0.1\nlast commit:\ncommit date:","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-28":{"id":28,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["fill","center"],"alignment":null}}},"order":[0,25,23,27,28,9,8,5,2,3,4],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"},"activeId":23}
    */

    // MAINWINDOW
    // ==========
    // var mainWindow = new Window("dialog");
    var mainWindow = createDockableUI(thisObj);
    mainWindow.text = "Exposure Sheet Import";
    mainWindow.orientation = "column";
    mainWindow.alignChildren = ["fill", "top"];
    mainWindow.spacing = 10;
    mainWindow.margins = 16;

    // ABOUTPANEL
    // ==========
    var aboutPanel = mainWindow.add("group", undefined, undefined, { name: "aboutPanel" });
    aboutPanel.text = "About";
    aboutPanel.orientation = "row";
    aboutPanel.alignChildren = ["left", "center"];
    aboutPanel.spacing = 10;
    aboutPanel.margins = 5;

    var logoImage = aboutPanel.add("image", undefined, img, { name: "logoImage" });

    var versionText = aboutPanel.add("group", undefined, { name: "versionText" });
    versionText.getText = function () { var t = []; for (var n = 0; n < versionText.children.length; n++) { var text = versionText.children[n].text || ''; if (text === '') text = ' '; t.push(text); } return t.join('\n'); };
    versionText.orientation = "column";
    versionText.alignChildren = ["left", "center"];
    versionText.spacing = 0;

    versionText.add("statictext", undefined, "version: " + VERSION);
    versionText.add("statictext", undefined, "last commit: " + LAST_COMMIT);
    versionText.add("statictext", undefined, "commit date: " + COMMIT_DATE);

    // GROUP1
    // ======
    var group1 = mainWindow.add("group", undefined, { name: "group1" });
    group1.orientation = "column";
    group1.alignChildren = ["fill", "center"];
    group1.spacing = 10;
    group1.margins = 0;

    var openBtn = group1.add("button", undefined, undefined, { name: "openBtn" });
    openBtn.text = "Open XDTS";

    var timelineList_array = ["Timeline"];
    var timelineList = group1.add("dropdownlist", undefined, undefined, { name: "timelineList", items: timelineList_array });
    timelineList.enabled = false;
    timelineList.selection = 0;
    timelineList.alignment = ["fill", "center"];

    var divider1 = group1.add("panel", undefined, undefined, { name: "divider1" });
    divider1.alignment = "fill";

    var importAsCheckbox = group1.add("checkbox", undefined, undefined, { name: "importAsCheckbox" });
    importAsCheckbox.helpTip = "Renames the XDTS timeline being imported to what's provided below";
    importAsCheckbox.text = "Rename Import as";

    var importAsText = group1.add('edittext {properties: {name: "importAsText"}}');
    importAsText.enabled = false;
    importAsText.text = "";

    var alphaOrderCheckbox = group1.add("checkbox", undefined, undefined, { name: "alphaOrderCheckbox" });
    alphaOrderCheckbox.helpTip = "After Effects imports by numeric naming order, this option forces alphabetical order";
    alphaOrderCheckbox.text = "Alphabetical Filenames";

    var divider2 = group1.add("panel", undefined, undefined, { name: "divider2" });
    divider2.alignment = "fill";

    // GROUP2
    // ======
    var group2 = group1.add("group", undefined, { name: "group2" });
    group2.orientation = "row";
    group2.alignChildren = ["center", "center"];
    group2.spacing = 10;
    group2.margins = 0;

    var importBtn = group2.add("button", undefined, undefined, { name: "importBtn" });
    importBtn.enabled = false;
    importBtn.text = "Import";

    var cancelBtn = group2.add("button", undefined, undefined, { name: "cancelBtn" });
    cancelBtn.text = "Cancel";

    mainWindow.group1.openBtn.onClick = function () {
      var xdts = openXdtsFile();
      if (xdts == undefined) return;

      mainWindow.group1.timelineList.removeAll();
      xdts["timeTables"].forEach(function (timeline) {
        mainWindow.group1.timelineList.add("item", timeline["name"]);
      });
      mainWindow.xdts = xdts;
      mainWindow.group1.timelineList.selection = 0;
      mainWindow.group1.timelineList.enabled = true;
      mainWindow.group1.group2.importBtn.enabled = true;
    };

    mainWindow.group1.group2.importBtn.onClick = function () {
      try {
        var timelineSelected = mainWindow.group1.timelineList.selection.index;
        var timeline = mainWindow.xdts["timeTables"][timelineSelected];

        var trackNames = timeline["timeTableHeaders"].find(function (field) {
          return field["fieldId"] == 0;
        })["names"];
        if (trackNames == undefined) throw "Did not find any track names";

        var celField = timeline["fields"].find(function (field) {
          return field["fieldId"] == 0;
        });
        if (celField == undefined) throw "Problem parsing cel field";

        var timelineName = timeline["name"];
        if(importAsCheckbox.value) {
          timelineName = importAsText.text;
        }
        var totalFrames = timeline["duration"];
        var duration = frameTime * totalFrames;
        var compItem = app.project.items.addComp(timelineName, frameWidth, frameHeight, 1.0, duration, frameRate);
        compItem.bgColor = [1.0, 1.0, 1.0];
        mainWindow.compItem = compItem;
        var folderItem = app.project.items.addFolder(timelineName);
        mainWindow.footageResolutions = [];

        celField["tracks"].forEach(function (track) {
          var trackNum = track["trackNo"];
          var trackName = trackNames[trackNum];

          // checks if no frame or only null frame
          if (track["frames"].length == 0) return;
          if (track["frames"].length == 1) {
            var frame = track["frames"][0]["data"].find(function (d) { return d["id"] == 0; })["values"][0] - 1;
            if (isNaN(frame)) return;
          }

          var folder = new Folder(mainWindow.xdts.folder.absoluteURI);
          folder.changePath(trackName);

          var footageItem = importFootage(folder.absoluteURI, mainWindow.group1.alphaOrderCheckbox.value);
          if (footageItem == undefined) return;
          footageItem.name = trackName;
          footageItem.parentFolder = folderItem;

          if (mainWindow.footageResolutions.find(function (res) {
            return res["width"] == footageItem.width && res["height"] == footageItem.height;
          }) == undefined) {
            mainWindow.footageResolutions.push({ "width": footageItem.width, "height": footageItem.height });
          };
          var avLayer = addFootage(compItem, footageItem);
          var firstFrame = true;
          var frameOffset = 0;
          track["frames"].forEach(function (frame) {
            var inputFrame = frame["data"].find(function (d) { return d["id"] == 0; })["values"][0] - 1;
            var outputFrame = frame["frame"];
            if (!isNaN(inputFrame)) {
              if (firstFrame) {
                // offset the inputFrame if the sequence doesn't start at 1
                // A5.tga, A6.tga, A7.tga --> avLayer 1, 2, 3 for the purposes of remapping
                frameOffset = inputFrame;
                firstFrame = false;
              }
              remapFrame(avLayer, inputFrame - frameOffset, outputFrame);
            }
          });
          avLayer.inPoint = avLayer.timeRemap.keyTime(1);
          var lastFrame = track["frames"][track["frames"].length - 1];
          if (isNaN(lastFrame["data"][0]["values"][0] - 1)) {
            avLayer.outPoint = track["frames"][track["frames"].length - 1]["frame"] * frameTime; // set the duration
          } else {
            avLayer.outPoint = duration;
          }

        });

        if (mainWindow.compItem == undefined) return;
        var compWindow = createCompWindow();
        mainWindow.footageResolutions.forEach(function (res) {
          compWindow.group1.resolutionList.add("item", res["width"].toString() + "x" + res["height"].toString());
          compWindow.group1.resolutionList.selection = 0;
          compWindow.group1.group2.confirmBtn.enabled = true;
        });
        compWindow.group1.group2.confirmBtn.onClick = function () {
          var theComp = mainWindow.compItem;
          var origCompSize = [theComp.width, theComp.height];
          var null3DLayer = theComp.layers.addNull();
          null3DLayer.threeDLayer = true;
          null3DLayer.position.setValue([origCompSize[0] / 2, origCompSize[1] / 2, 0]);

          for (var i = 1; i <= theComp.numLayers; i++) {
            var curLayer = theComp.layer(i);
            if (curLayer != null3DLayer && curLayer.parent == null) {
              curLayer.parent = null3DLayer;
            }
          }
          var newCompSize = [
            mainWindow.footageResolutions[compWindow.group1.resolutionList.selection.index]["width"],
            mainWindow.footageResolutions[compWindow.group1.resolutionList.selection.index]["height"],
          ];
          theComp.width = newCompSize[0];
          theComp.height = newCompSize[1];
          null3DLayer.position.setValue([newCompSize[0] / 2, newCompSize[1] / 2, 0]);
          null3DLayer.remove();
          compWindow.close();
        };
        compWindow.show();
      } catch (e) {
        alert(e, "Error", true);
      }
    };

    importAsCheckbox.onClick = function () {
      importAsText.enabled = importAsCheckbox.value;
    };

    return mainWindow;
  }

  function createCompWindow() {
  /*
  Code for Import https://scriptui.joonas.me — (Triple click to select):
  {"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":"compWindow","windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"XdtsImport","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["fill","top"]}},"item-2":{"id":2,"type":"Group","parentId":28,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["center","center"],"alignment":null}},"item-3":{"id":3,"type":"Button","parentId":2,"style":{"enabled":false,"varName":"confirmBtn","text":"Confirm","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-4":{"id":4,"type":"Button","parentId":2,"style":{"enabled":true,"varName":"cancelBtn","text":"Cancel","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-5":{"id":5,"type":"Divider","parentId":28,"style":{"enabled":true,"varName":null}},"item-23":{"id":23,"type":"Image","parentId":25,"style":{"enabled":true,"varName":"logoImage","image":[""],"alignment":null,"helpTip":""}},"item-25":{"id":25,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"aboutPanel","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"About","preferredSize":[0,0],"margins":5,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-27":{"id":27,"type":"StaticText","parentId":25,"style":{"enabled":true,"varName":"versionText","creationProps":{},"softWrap":false,"text":"version: 0.0.1\nlast commit:\ncommit date:","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-28":{"id":28,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["fill","center"],"alignment":null}},"item-29":{"id":29,"type":"ListBox","parentId":28,"style":{"enabled":true,"varName":"resolutionList","creationProps":{"multiselect":false,"numberOfColumns":1,"columnWidths":"[]","columnTitles":"[]","showHeaders":false},"listItems":"","preferredSize":[0,0],"alignment":null,"helpTip":null}}},"order":[0,25,23,27,28,29,5,2,3,4],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"},"activeId":0}
  */

    // COMPWINDOW
    // ==========
    var compWindow = new Window("dialog");
    compWindow.text = "Exposure Sheet Import";
    compWindow.orientation = "column";
    compWindow.alignChildren = ["fill", "top"];
    compWindow.spacing = 10;
    compWindow.margins = 16;

    // ABOUTPANEL
    // ==========
    var aboutPanel = compWindow.add("panel", undefined, undefined, { name: "aboutPanel" });
    aboutPanel.text = "About";
    aboutPanel.orientation = "row";
    aboutPanel.alignChildren = ["left", "center"];
    aboutPanel.spacing = 10;
    aboutPanel.margins = 5;

    var logoImage = aboutPanel.add("image", undefined, img, { name: "logoImage" });

    var versionText = aboutPanel.add("group", undefined, { name: "versionText" });
    versionText.getText = function () { var t = []; for (var n = 0; n < versionText.children.length; n++) { var text = versionText.children[n].text || ''; if (text === '') text = ' '; t.push(text); } return t.join('\n'); };
    versionText.orientation = "column";
    versionText.alignChildren = ["left", "center"];
    versionText.spacing = 0;

    versionText.add("statictext", undefined, "version: " + VERSION);
    versionText.add("statictext", undefined, "last commit: " + LAST_COMMIT);
    versionText.add("statictext", undefined, "commit date: " + COMMIT_DATE);

    // GROUP1
    // ======
    var group1 = compWindow.add("group", undefined, { name: "group1" });
    group1.orientation = "column";
    group1.alignChildren = ["fill", "center"];
    group1.spacing = 10;
    group1.margins = 0;

    var resolutionList = group1.add("dropdownlist", undefined, undefined, { name: "resolutionList" });

    var divider1 = group1.add("panel", undefined, undefined, { name: "divider1" });
    divider1.alignment = "fill";

    // GROUP2
    // ======
    var group2 = group1.add("group", undefined, { name: "group2" });
    group2.orientation = "row";
    group2.alignChildren = ["center", "center"];
    group2.spacing = 10;
    group2.margins = 0;

    var confirmBtn = group2.add("button", undefined, undefined, { name: "confirmBtn" });
    confirmBtn.enabled = false;
    confirmBtn.text = "Confirm";

    var cancelBtn = group2.add("button", undefined, undefined, { name: "cancelBtn" });
    cancelBtn.text = "Cancel";

    return compWindow;
  }

  function openXdtsFile() {
    var xdtsFile = new File(".").openDlg("Import XDTS...", "*.xdts", false);
    if (xdtsFile == null) return;
    var xdts = parseXdtsFile(xdtsFile.absoluteURI);
    xdts.folder = xdtsFile.parent;
    return xdts;
  }

  var frameRate = 24;
  var frameTime = (1 / 24);
  var frameWidth = 1920;
  var frameHeight = 1080;

  function xdtsImport(thisObj) {
    var proj = app.project;
    var scriptName = "Exposure Sheet Import";
    var scriptsFile = new File($.fileName);

    var mainWindow = createMainWindow(thisObj);
    showWindow(mainWindow);

  }

  function parseXdtsFile(xdtsFilePath) {
    var xdtsFile = new File(xdtsFilePath);
    try {
      if (xdtsFile == null) throw 'No file';

      xdtsFile.open('r');
      xdtsFile.encoding = 'UTF-8';

      if (!xdtsFile.exists) throw "File does not exist";
      // kinda inefficient to split and rejoin later but avoids a bug with reading
      // files line by line
      var contents = xdtsFile.read().split('\n');
      if (contents[0] != "exchangeDigitalTimeSheet Save Data") {
        throw "Invalid XDTS file with header: \n"
        + "-------------------------------\n"
        + contents[0];
      }

      var xdts;
      xdts = JSON.parse(contents.slice(1).join('\n'));
      return xdts;
    } catch (e) {
      alert(e, "Error", true);
    } finally {
      xdtsFile.close();
    }
  }
  function importFootage(folderPath, forceAlphabetical) {
    var importOptions = new ImportOptions();
    try {
      var files = new Folder(folderPath).getFiles();

      // assumes the first file will allow grabbing the rest, skipping desktop.ini
      importOptions.file = (files[0].name.substring(files[0].name.length - 4) != ".ini") ? files[0] : files[1];
      importOptions.importAs = ImportAsType.FOOTAGE;
      importOptions.sequence = true;
      importOptions.forceAlphabetical = forceAlphabetical;

      var footageItem = app.project.importFile(importOptions);
      footageItem.mainSource.conformFrameRate = frameRate;
      return footageItem;
    } catch (e) {
      return undefined;
    }
  }

  function addFootage(comp, item) {
    var layer = comp.layers.add(item);
    layer.timeRemapEnabled = true;
    // timeRemap automatically creates two key frames for the duration of the
    // footage so we remove the second one
    layer.timeRemap.removeKey(2);
    return layer;
  }
  /**
   * careful with start indexing
   * @param {AVLayer} layer
   * @param {number} inputFrame [0..]
   * @param {number} outputFrame [0..]
   */
  function remapFrame(layer, inputFrame, outputFrame) {
    var key = layer.timeRemap.addKey(frameTime * outputFrame);
    layer.timeRemap.setValueAtKey(key, frameTime * inputFrame);
    layer.timeRemap.setInterpolationTypeAtKey(key, KeyframeInterpolationType.HOLD);
    if (inputFrame == 0 && outputFrame > 0 && !layer.firstFrameSet) {
      layer.timeRemap.removeKey(1);
    }
    layer.firstFrameSet = true;
  }
  xdtsImport(this);
}

//// ExposureSheetImport.jsx
