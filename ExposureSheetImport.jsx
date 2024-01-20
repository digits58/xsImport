//// ExposureSheetImport.jsx

/// Imports Footage with the Toei Digital Timesheet file format v7 (*.xdts)

// Author: 58 <digits58 at gmail dot com>
// Homepage:
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

//     v0.0.6 - 2024/01/19:
//     Fix bug with reading xdts files on Japanese locales due to SJIS

var VERSION = "0.0.6";
var LAST_COMMIT = "5e56a0e";
var COMMIT_DATE = "2024/01/19";

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

    var alphaOrderCheckbox = group1.add("checkbox", undefined, undefined, {name: "alphaOrderCheckbox"}); 
    alphaOrderCheckbox.helpTip = "After Effects imports by numeric naming order, this option forces alphabetical order"; 
    alphaOrderCheckbox.text = "Alphabetical Filenames";
  
    var divider1 = group1.add("panel", undefined, undefined, { name: "divider1" });
    divider1.alignment = "fill";

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

        var totalFrames = timeline["duration"];
        var duration = frameTime*totalFrames;
        var compItem = app.project.items.addComp(timeline["name"], frameWidth, frameHeight, 1.0, duration, frameRate);
        compItem.bgColor = [1.0, 1.0, 1.0];
        mainWindow.compItem = compItem;
        var folderItem = app.project.items.addFolder(timeline["name"]);
        mainWindow.footageResolutions = [];

        celField["tracks"].forEach(function (track) {
          var trackNum = track["trackNo"];
          var trackName = trackNames[trackNum];

          // checks if no frame or only null frame
          if (track["frames"].length == 0) return;
          if (track["frames"].length == 1) {
            var frame = track["frames"][0]["data"].find(function (d) {return d["id"] == 0;})["values"][0]-1;
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
            mainWindow.footageResolutions.push({"width": footageItem.width, "height": footageItem.height});
          };
          var avLayer = addFootage(compItem, footageItem);
          track["frames"].forEach(function (frame) {
            var inputFrame = frame["data"].find(function (d) { return d["id"] == 0; })["values"][0]-1;
            var outputFrame = frame["frame"];
            if (!isNaN(inputFrame)) remapFrame(avLayer, inputFrame, outputFrame);
          });
          avLayer.inPoint = avLayer.timeRemap.keyTime(1);
          var lastFrame = track["frames"][track["frames"].length-1];
          if (isNaN(lastFrame["data"][0]["values"][0]-1)) {
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
    } catch(e) {
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
    } catch(e) {
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
