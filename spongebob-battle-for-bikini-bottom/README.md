# SpongeBob: Battle for Bikini Bottom - Rehydrated

⚠ Ordinarily, scalability group settings (e.g. `sg.ShadowQuality=0`) would be used and set in the `GameUserSettings.ini` file, however the game will overwrite these values. The tweaks here instead replace the scalability group overrides with the individual settings that they would normally apply ([https://docs.unrealengine.com/latest/INT/TestingAndOptimization/PerformanceAndProfiling/Scalability/ScalabilityReference/](https://docs.unrealengine.com/latest/INT/TestingAndOptimization/PerformanceAndProfiling/Scalability/ScalabilityReference/))

#### Instructions

1. Open the following file in an editor:

   - Proton: `~/.steam/steam/steamapps/compatdata/969990/pfx/drive_c/users/steamuser/AppData/Local/Pineapple/Saved/Config/WindowsNoEditor/Engine.ini`

   - Windows: `C:/users/(user)/AppData/Local/Pineapple/Saved/Config/WindowsNoEditor/Engine.ini`

1. Copy the contents of the `Engine.ini` file in this directory at the end of the file (replace any existing `[SystemSettings]`)

1. Modify the values as documented in the file

1. If you're still unable to achieve desired performance, as a last resort reduce `sg.ResolutionQuality` in `GameUserSettings.ini`

   > ⓘ This will drastically affect visual quality
