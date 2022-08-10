# Consortium: The Tower

#### Instructions

1. Open the following file in an editor:

   - Proton: `~/.steam/steam/steamapps/common/Consortium The Tower/thetower/Saved/Config/WindowsNoEditor/Engine.ini`

   - Windows: See here: [https://www.pcgamingwiki.com/wiki/Consortium:\_The_Tower#Configuration_file.28s.29_location](https://www.pcgamingwiki.com/wiki/Consortium:_The_Tower#Configuration_file.28s.29_location)

1. Copy the contents of the `Engine.ini` file in this directory at the end of the file (replace any existing `[SystemSettings]`)

1. Modify the values as documented in the file

1. If you're still unable to achieve desired performance, as a last resort reduce `sg.ResolutionQuality`

   > ⓘ This will drastically affect visual quality

#### Other notes

- The game has the Unreal console enabled by default, which you can use to test different settings in-game. Press <kbd>~</kbd> to open the console.

- Put save directory (`~/.steam/steam/steamapps/common/Consortium The Tower/thetower/Saved/csav`) in Dropbox in order to be able to go back to previous saves
  - In particular, you'll want to revert these files to go back to a previous save:
    - instance.cinst
    - persistent.csav
