# Fallout 4

#### Maximise performance

1. Launch the game

1. Pick all the lowest graphics options (including in the advanced menu)

1. Exit the game and add the following to ~/.steam/steam/steamapps/compatdata/377160/pfx/drive_c/users/steamuser/Documents/My Games/Fallout4/Fallout4Prefs.ini

   ```ini
   iMaxAnisotropy=0
   ```

#### Windowed mode

Add the following to ~/.steam/steam/steamapps/compatdata/377160/pfx/drive_c/users/steamuser/Documents/My Games/Fallout4/Fallout4Prefs.ini

```ini
bBorderless=0
bFull Screen=0
iSize H=720
iSize W=1280
```

(height/width might need to be set in the graphical interface; change values as needed)

#### Disable blood and gore

Add the following to ~/.steam/steam/steamapps/compatdata/377160/pfx/drive_c/users/steamuser/Documents/My Games/Fallout4/Fallout.ini

```ini
[General]
bDisableAllGore=1

[ScreenSplatter]
bBloodSplatterEnabled=0
```

#### Fix crashing at start

If the game crashes when you click _Play_, delete the INI files from ~/.steam/steam/steamapps/compatdata/377160/pfx/drive_c/users/steamuser/Documents/My Games/Fallout4/ and start the game again to generate new ones
