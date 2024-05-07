# xsImport

Imports and timeremap xdts files into Adobe After Effects

After Effectsスクリプトの機能はXDTSファイルで自動TimeRemapです

## Why
There are difficulties during compositing to take exported animation frames and importing them into AfterEffects with correct timing. Current methods include tedious work to manually time the frames and/or consumes space to avoid it. This provides a solution to both. The script allows the user to read a common file format XDTS for timesheets to automatically import all frames and time them correctly in AfterEffects. It is estimated to save ~24hr of production time for every minute of animation produced and in some cases avoid accumulating 100's of GB from importing with video files instead of image sequences.

## Install / Download
Find the releases on the sidebar on the right or visit [Releases](https://github.com/digits58/xsImport/releases) to download the latest version `ExposureSheetImport-vX.X.X.jsx`

![image](https://github.com/digits58/xsImport/assets/115112505/ca2c8485-0047-46f5-a61f-e2770dd8617b)

![image](https://github.com/digits58/xsImport/assets/115112505/1790d588-86b0-41d4-8548-c204a9df03c0)


## Usage
![image](https://user-images.githubusercontent.com/115112505/195144996-5333424f-1a44-4bd8-8f8f-6641ab4203ae.png)

1. The folder structure should be like this with each animation layer with the cell exports. It is not required to have these names be A, B, C, or etc. however they must be named as they are in the xdts timesheet. The names of the cels within the folder do not matter as long as they are in alphabetical order. 

![image](https://user-images.githubusercontent.com/115112505/195145028-d3edf9a3-ffaf-443f-8c56-657b65c8f337.png)

2. The script will pop up a dialog to select the xdts file to import and provides the option to select which timeline to import. 

![image](https://user-images.githubusercontent.com/115112505/195145066-7b82e5eb-625e-4ece-bbf4-2cafe86145f5.png)

3. Each cell animation layer is imported as image sequences and added to a new composition
4. The timeline information from the xdts file is then used to time remap all the frames

## Options
### Import XDTS Timeline as
By default the script will import the timeline from the XDTS file using the name.  The newly created composition and footage item will use the same name.  Enabling the `Import XDTS Timeline as` option will instead rename the these newly created composition and footage item to whatever is provided. 

### Alphabetical Filenames
The script uses imports frames in numerical order so it frames are imported as A1, A2, A3, ..., etc.  The `Alphabetical Filenames` checkbox option allows the script to import in alphabetical order so A1a, A1b, A2, etc...  However this will only work when there are <=9 keyframes (A1,A2,A3,...,A9).  If the script uses the alphabetical option and there are >9 keyframes, the order will be A1, A10, A2, A2a, A3, ..., A9 instead of A1, A2, A2a, A3, ..., A9, A10 so renaming as A01, A02, A02a, A03, ...., A10 is needed.

### Start Frame Offset
This option allows offsetting the start frame being displayed in the new composition by whatever value provided. This is typically set in the project settings but this option allows offsetting it with any value within the composition. Here's an example of offsetting the start frame to 5.
![image](https://github.com/digits58/xsImport/assets/115112505/c62a7bef-4dba-4dda-8cc4-fd6117ab6ae6)

## Notes
### Frame Mark Out Behaviour
XDTS allows "marking out" a frame/cel which corresponds to the `X` on an xsheet so that it becomes hidden.  The script accounts for this by using Opacity keyframes set to 0% when the frame/cel is marked out and the 100% on the next exposure.

## License
Project under MIT License

## Special Thanks
[GreenBlueClouds](https://greenblueclouds.tumblr.com)
