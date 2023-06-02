# Civilization IV

#### Initial setup

1. In Steam, install _Sid Meier's Civilization IV: Beyond the Sword_
1. Right-click the game > _Properties_ > _Betas_ > select _original_release_unsupported_
1. Still in the game properties, go to _General_ and set _Launch Options_ to (to prevent graphical flickering):

   ```
   PROTON_USE_WINED3D=1 %command%
   ```

1. In game, set graphical options

   1. Set all graphical settings except antialiasing to highest and restart the game
   1. Set resolution to desired resolution
   1. Gradually increase antialiasing until it starts affecting framerate
   1. Exit the game

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
   STEAM_COMPAT_DATA_PATH="/home/$USER/.local/share/Steam/steamapps/compatdata/8800" STEAM_COMPAT_CLIENT_INSTALL_PATH="/home/$USER/.local/share/Steam" "$HOME/.local/share/Steam/steamapps/common/Proton 7.0"/proton waitforexitandrun Planetfall_v16_Main.exe
   ```

   (Adjust `Proton 7.0` as needed)

   1. In the installer, browse to your **Sid Meier's Civilization IV Beyond the Sword\Beyond the Sword** directory, e.g. Z:\home\user\.local\share\Steam\steamapps\common\Sid Meier's Civilization IV Beyond the Sword\Beyond the Sword\

      ⚠ If you browse to _Sid Meier's Civilization IV Beyond the Sword_ instead, the installer won't let you continue

1. Run the mod patch installer

   ```
   STEAM_COMPAT_DATA_PATH="/home/$USER/.local/share/Steam/steamapps/compatdata/8800" STEAM_COMPAT_CLIENT_INSTALL_PATH="/home/$USER/.local/share/Steam" "$HOME/.local/share/Steam/steamapps/common/Proton 7.0"/proton waitforexitandrun Planetfall_v16f_Patch.exe
   ```

1. (Optional) To launch Planetfall directly when starting Civ IV, right-click the game in the Steam client > _Properties_ and set _Launch Options_ to

   ```
   PROTON_USE_WINED3D=1  %command% "mod=\\Planetfall v16"
   ```
