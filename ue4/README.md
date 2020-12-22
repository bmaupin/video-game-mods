# Unreal Engine 4

#### Installation

1. Find your game's Config/WindowsNoEditor directory

1. For each .ini file in this directory, copy the contents into your game's configuration files after any existing content

   ⚠️ Avoid overwriting any essential configuration, such as the `[Core.System]` section in your game's Engine.ini file

1. Go through the configs and tweak any values as desired

1. If desired, you can tweak individual settings through the UE4 console ( see below)

#### Changing configuration via the UE4 console

1. Use the [Universal Unreal Engine 4 Unlocker](https://framedsc.github.io/GeneralGuides/universal_ue4_consoleunlocker.htm) to unlock the console for the game

   ⚠️ This will probably not work for games installed via the Microsoft Store or Xbox Game Pass

1. Press <kbd>~</kbd> to open the console in the game

   - Use this command in the console to show the FPS

     ```
     stat fps
     ```

   - Press <kbd>~</kbd> twice to make the console bigger to see output, history, etc

   - Type the name of a parameter to see its current value

     ```
     r.ShadowQuality
     ```

   - To change a parameter:

     ```
     r.ShadowQuality 1
     ```

#### Testing

1. Install one of the UE4 demos: [Unreal Engine 4 - Five Tech Demos](https://www.techpowerup.com/download/unreal-engine-4-five-tech-demos/)

   or install a game that uses Unreal Engine 4: [https://en.wikipedia.org/wiki/List_of_Unreal_Engine_games#Unreal_Engine_4](https://en.wikipedia.org/wiki/List_of_Unreal_Engine_games#Unreal_Engine_4)

1. Use the UE4 console to tweak settings while the game is running (see above) in order to optimize these configs
