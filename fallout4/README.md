# Fallout 4

#### Maximise performance

1. Launch the game

1. Pick all the lowest graphics options (including in the advanced menu)

1. Edit ~/.steam/steam/steamapps/compatdata/377160/pfx/drive_c/users/steamuser/Documents/My Games/Fallout4/Fallout4Prefs.ini

   ```
   iMaxAnisotropy=0
    bBorderless=0
    bFull Screen=0
    iSize H=720
    iSize W=1280
   ```

   (height/width might need to be set in the graphical interface)

If you've copied INI files from elsewhere and the game crashes when you click Play, move the INI files out of the way and use the UI to create new ones

#### Disable blood and gore

Add the following to ~/.steam/steam/steamapps/compatdata/377160/pfx/drive_c/users/steamuser/Documents/My Games/Fallout4/Fallout.ini

```
[General]
bDisableAllGore=1

[ScreenSplatter]
bBloodSplatterEnabled=0
```
