# xsImport

Imports and timeremap xdts files into Adobe After Effects

After Effectsスクリプトの機能はXDTSファイルで自動TimeRemapです

## Why
There are difficulties during compositing to take exported animation frames and importing them into AfterEffects with correct timing. Current methods include tedious work to manually time the frames and/or consumes space to avoid it. This provides a solution to both. The script allows the user to read a common file format XDTS for timesheets to automatically import all frames and time them correctly in AfterEffects. It is estimated to save ~24hr of production time for every minute of animation produced and in some cases avoid accumulating 100's of GB from importing with video files instead of image sequences.

## Install / Download
Find the releases on the sidebar on the right or visit [Releases](https://github.com/digits58/xsImport/releases) to download the latest version `ExposureSheetImport-vX.X.X.jsx`

## Usage
![image](https://user-images.githubusercontent.com/115112505/195144996-5333424f-1a44-4bd8-8f8f-6641ab4203ae.png)

1. The folder structure should be like this with each animation layer with the cell exports. It is not required to have these names be A, B, C, or etc. however they must be named as they are in the xdts timesheet. The names of the cels within the folder do not matter as long as they are in alphabetical order. 

![image](https://user-images.githubusercontent.com/115112505/195145028-d3edf9a3-ffaf-443f-8c56-657b65c8f337.png)

2. The script will pop up a dialog to select the xdts file to import and provides the option to select which timeline to import. 

![image](https://user-images.githubusercontent.com/115112505/195145066-7b82e5eb-625e-4ece-bbf4-2cafe86145f5.png)

3. Each cell animation layer is imported as image sequences and added to a new composition
4. The timeline information from the xdts file is then used to time remap all the frames
## License
Project under MIT License
