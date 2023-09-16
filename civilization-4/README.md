# Civilization IV

## Initial setup

1. In Steam, install _Sid Meier's Civilization IV: Beyond the Sword_
1. Right-click the game > _Properties_ > _Betas_ > select _original_release_unsupported_

   ⓘ This is needed in order to play the game with mods (see below)

1. In the Steam client, go to the game and click the ⓘ icon to see which version of Proton is used

   - Make sure it's at least Proton 8, otherwise you'll need to use workarounds to fix graphical glitches

1. In game, set graphical options

   1. Set all graphical settings except antialiasing to highest and restart the game
   1. Set resolution to desired resolution
   1. Gradually increase antialiasing until it starts affecting framerate
   1. Exit the game

## Tips for faster gameplay

#### In-game tips

- Read this guide first: [Useful shortcuts and features to improve gameplay speed](https://steamcommunity.com/sharedfiles/filedetails/?id=2313060416)
- While in game, in many places in the UI you can right-click on text to go directly to the Civilopedia entry for that item (e.g. units, technologies, buildings, etc)
  - This is especially helpful since some screens can't be dismissed without making a choice, like when it's time to choose a new technology to research or a new unit or building for a city's building queue

#### General options

These options apply to all games and can be changed at any time, including during a game

1. Go to the general game options page

   - In the main menu before starting a game, go to _Advanced_ > _Options_
   - Or in a game, go to the main menu > _Options_

1. Change the options as desired

   - Uncheck _Wait at End of Turn_
     - It will still pause at the end of the turn if no decisions need to be made that turn
     - This is especially nice at the beginning of the game when turns tend to be short. Later it can be checked if desired, e.g. during wars.
   - Check:
     - _Quick Moves_
     - _Quick Combat (Offense)_
     - _Workers Start Automated_
     - _Missionaries Start Automated_

#### Game-specific options

These options only apply to one specific game and can only be set before the game is started

1. At the main screen, instead of clicking _Play Now!_, click _Custom Game_ and set these options as desired

   1. Set the map _Size_
      - This has the biggest impact on game length; a smaller map will mean a much quicker game
      - Even the _Duel_ map size is surprisingly large; in a game with 5 other civs I was able to build half a dozen cities
   1. Add as many civilizations as you'd like
      - Even in a _Duel_ map you can easily fit 5 or more players on the map (**note** that this doesn't apply if you mod the map sizes as described below)
   1. Set _Speed_ to _Quick_
   1. Under _Options_, check these:
      - _No City Razing_
        - This speeds up the game because without it, razed cities would need to be rebuilt
      - _No City Flipping From Culture_
        - This gives you one less thing to worry about
      - _No Vassal States_
        - Vassal states can be annoying because they can lock you into a war with multiple civilizations
      - _No Espionage_
        - One less system to worry about; espionage points get automatically converted to culture points
      - _No Free GPs When Founding a Religion_
        - One less unit to worry about
   1. Under _Victories_, turn off any victory conditions you don't want to worry about
   1. Don't forget to set the difficulty

#### Modding map sizes

ⓘ This is a pretty extreme measure, but from my experience, the map size is the single biggest factor when it comes to game length. Without this, even after following all of the above steps, a game with the duel map (the smallest map size) on quick speed can take over 7 hours. That same game can be reduced to 1 hour if the map size is reduced sufficiently.

1. First, modify the global map sizes

   ⓘ Back up files before changing them to make the changes easier to undo

   1. Modify `Assets/XML/GameInfo/CIV4WorldInfo.xml`

      - e.g. for Beyond the Sword, modify `Beyond the Sword/Assets/XML/GameInfo/CIV4WorldInfo.xml`
      - e.g. for Planetfall, modify `Beyond the Sword/Mods/Planetfall v16/Assets/XML/GameInfo/CIV4WorldInfo.xml`
      - For Dune Wars, see below

   1. Modify `iGridWidth`/`iGridHeight` for each map size

      - My recommendation: change the grid sizes (X and Y) to 3/4/5/6/7/8 respectively for each of the different map sizes, e.g. for duel:

        ```xml
        <iGridWidth>3</iGridWidth>
        <iGridHeight>3</iGridHeight>
        ```

        Each grid is 4 tiles; this will result in a map of 12 x 12 tiles (the default size for duel maps is 40 x 24 tiles)

1. If that doesn't work for a particular map, you may also need to modify `getGridSize` in the map script

   - e.g. for the Dune Wars Arrakis map, modify `Beyond the Sword/Mods/DuneWars Revival/PrivateMaps/Arrakis.py`

     - Before:

       ```python
       def getGridSize(argsList):
         # ...
         WorldSizeTypes.WORLDSIZE_DUEL:       (8,8),
         WorldSizeTypes.WORLDSIZE_TINY:       (10,10),
         WorldSizeTypes.WORLDSIZE_SMALL:      (13,13),
         WorldSizeTypes.WORLDSIZE_STANDARD:   (16,16),
         WorldSizeTypes.WORLDSIZE_LARGE:      (18,18),
         WorldSizeTypes.WORLDSIZE_HUGE:       (21,21),
       ```

     - After:

       ```python
       def getGridSize(argsList):
         # ...
         WorldSizeTypes.WORLDSIZE_DUEL:       (3,3),
         WorldSizeTypes.WORLDSIZE_TINY:       (4,4),
         WorldSizeTypes.WORLDSIZE_SMALL:      (5,5),
         WorldSizeTypes.WORLDSIZE_STANDARD:   (6,6),
         WorldSizeTypes.WORLDSIZE_LARGE:      (7,7),
         WorldSizeTypes.WORLDSIZE_HUGE:       (8,8),
       ```

1. Take the new map sizes into account when starting a game. For example, with the unmodded duel map size you could easily fit 5-6 players in the map, with this duel map size it can only realistically fit 2 players, tiny can only fit 3 players, etc.

1. When playing the game you may also want to make other adjustments. For example, with an unmodded map size one strategy is to build cities 4 tiles apart to maximise the number of tiles the city can work. With these modded map sizes, you'll probably want to build cities as close together as possible.

## Mods

#### Install [Dune Wars](https://forums.civfanatics.com/resources/dune-wars-revival-villeneuve-inspired-patch.28465/) mod on Proton

1. Download DuneWars Revival v1.10 from here: [https://www.moddb.com/mods/dune-wars/downloads/dunewars-revival-v110](https://www.moddb.com/mods/dune-wars/downloads/dunewars-revival-v110)

1. Extract it and move it to the mods directory

   ```
   unzip DuneWars_Revival-v.1.10.zip
   mv DuneWars\ Revival/ ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/
   ```

1. Change the case of a couple directories so they'll be properly overwritten

   ```
   mv ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/DuneWars\ Revival/Assets/Sounds/soundtrack/ ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/DuneWars\ Revival/Assets/Sounds/Soundtrack
   mv ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/DuneWars\ Revival/Assets/XML/GameInfo/ ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/DuneWars\ Revival/Assets/XML/Gameinfo
   ```

1. Download the latest VIP update from here: [https://forums.civfanatics.com/resources/dune-wars-revival-villeneuve-inspired-patch.28465/updates](https://forums.civfanatics.com/resources/dune-wars-revival-villeneuve-inspired-patch.28465/updates) > _Go to download_

1. Extract it and overwrite the DuneWars Revival mods directory

   ```
   unzip DuneWarsRevival_VilleneuveInspiredPatch-dwr-vip-5.8.zip
   cp -av DuneWarsRevival_VilleneuveInspiredPatch-dwr-vip-5.8/DuneWars\ Revival/ ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/
   ```

1. (Optional) Double-check that there are no duplicate files with different case

   ```
   find ~/.steam/steam/steamapps/common/Sid\ Meier\'s\ Civilization\ IV\ Beyond\ the\ Sword/Beyond\ the\ Sword/Mods/ | sort -f | uniq -i -d
   ```

   (Source: [How to find duplicate files with same name but in different case that exist in same directory in Linux?](https://stackoverflow.com/a/6705008/399105))

1. (Optional) To launch Dune Wars directly when starting Civ IV, right-click the game in the Steam client > _Properties_ and set _Launch Options_ to

   ```
   %command% "mod=\\DuneWars Revival"
   ```

#### Install [Planetfall](https://forums.civfanatics.com/threads/download-thread.253775/) mod on Proton

1. Download Planetfall from here: https://forums.civfanatics.com/threads/download-thread.253775/
   1. Download the main file
   1. Download the latest patch
   1. (Optional) download the audio files
   1. (Optional) download the movies **from the link in the last comment in the thread**
1. In Proton, enable showing dotfiles
   1. `protontricks 8800 winecfg`
   2. _Drives_ > check _Show dot files_ > _OK_
1. In the Steam client, go to the game and click the ⓘ icon to see which version of Proton is used
1. Run the mod main installer

   ```
   STEAM_COMPAT_DATA_PATH="/home/$USER/.local/share/Steam/steamapps/compatdata/8800" STEAM_COMPAT_CLIENT_INSTALL_PATH="/home/$USER/.local/share/Steam" "$HOME/.local/share/Steam/steamapps/common/Proton 8.0"/proton waitforexitandrun Planetfall_v16_Main.exe
   ```

   (Adjust `Proton 8.0` as needed)

   1. In the installer, browse to your **Sid Meier's Civilization IV Beyond the Sword\Beyond the Sword** directory, e.g. Z:\home\user\.local\share\Steam\steamapps\common\Sid Meier's Civilization IV Beyond the Sword\Beyond the Sword\

      ⚠ If you browse to _Sid Meier's Civilization IV Beyond the Sword_ instead, the installer won't let you continue

1. Run the mod patch installer

   ```
   STEAM_COMPAT_DATA_PATH="/home/$USER/.local/share/Steam/steamapps/compatdata/8800" STEAM_COMPAT_CLIENT_INSTALL_PATH="/home/$USER/.local/share/Steam" "$HOME/.local/share/Steam/steamapps/common/Proton 8.0"/proton waitforexitandrun Planetfall_v16f_Patch.exe
   ```

1. (Optional) To launch Planetfall directly when starting Civ IV, right-click the game in the Steam client > _Properties_ and set _Launch Options_ to

   ```
   %command% "mod=\\Planetfall v16"
   ```
