# Deus Ex 1

#### Windowed mode

1. Open the game and change the resolution to the desired value

1. Exit the game and edit this file: ~/.steam/steam/steamapps/common/Deus Ex/System/DeusEx.ini

   1. Change `StartupFullscreen=True` to `StartupFullscreen=False`

   1. Also set `WindowedColorBits=16` to `WindowedColorBits=32` and `FullscreenColorBits=16` to `FullscreenColorBits=32` for 32-bit colour

#### Reduce gore

Go to _Settings_ > _Game Options_ and change _Gore Level_ to _Low_

Or edit this file: ~/.steam/steam/steamapps/common/Deus Ex/System/DeusEx.ini and change `bLowGore=False` to `bLowGore=True`

#### Remap keys

Go to _Settings_ > _Keyboard/Mouse_

1. Change _F12_ (light enhancement mode) to `F` (aka flashlight)

   - F12 is the default key for Steam screenshots, so it's either remap the game or change the key used by Steam
   - F in the game is used by default to center the view. Pretty useless

#### Apply patches to make game marginally more family-friendly

This updates clothing for some characters and removes a billboard

1. Download [patch-deusex.ts](patch-deusex.ts) from this directory and run it using `npx` (requires Node.js 10 or later):

   ```
   npx -p typescript tsc patch-deusex.ts; node patch-deusex.js ~/.steam/steam/steamapps/common/Deus\ Ex/
   ```

   (Replace `~/.steam/steam/steamapps/common/Deus\ Ex/` with the path to your Deus Ex directory)

   Change the path to your Deus Ex directory as needed
