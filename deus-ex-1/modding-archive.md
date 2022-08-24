# Deus Ex 1 modding (archived documentation)

## Meshes

#### Open meshes in Blender

1. Install Blender

1. Install this Blender plugin: https://github.com/Skywolf285/UE1-VertexMesh-Blender-IO

1. Export mesh using umodel

   - Make sure _Skeletal Mesh_ and _Static Mesh_ are both set to _ActorX_

   - ~~Select glTF for both mesh types~~

1. Open Blender

1. Clear existing content

   1. Near the top right _Select_ > _All_

   1. Press <kbd>Delete</kbd>

1. Import mesh in Blender

   _File_ > _Import_ > _Unreal Engine Vertex Mesh_

1. Press the middle mouse button and move it around to rotate the view

1. Click and hold the left mouse button on the hand icon in the right to move the view

#### Smooth objects

1. Near the top right change _Object Mode_ to _Sculpt Mode_

1. On the left, select _Smooth_

1. Right-click in the main pane and adjust _Radius_ and _Strength_ as desired

1. Click near the center of the area to smooth

## Misc

#### Create XXD patch

ⓘ Since plain text files are easier to work with, this method uses plain text patch files, which is possible because we're working with small files and the length of the files isn't being changed.

- Create a patch file manually

  Patch files are pretty straightforward, each line has an address, byte, and optional comment, e.g.

  ```
  0047b087: ed # BumFemale BumFemaleTex1 -> JunkieMaleTex1
  0047b088: 12
  ```

- Or, edit the file with a hex editor and create the patch file using `xxd`:

  1.  Edit the file with a hex editor

      1. Open DeusEx.u with a hex editor

         ```
         ghex ~/.steam/steam/steamapps/common/Deus\ Ex/System/DeusEx.u
         ```

      1. Go to the byte offset

         e.g. for ghex use _Edit_ > _Goto Byte_

      1. Make sure the value of the property matches what you found earlier

      1. Replace the value of the old texture with the value of the new texture

         In ghex, you can type directly into the main window to edit the file

         e.g. replace E4 12 at 0x000525c6 with D9 0C

      1. Save the file

  1.  Generate the patch

      ```
      comm -13 <(xxd -c1 DeusEx.u.bak) <(xxd -c1 DeusEx.u) > DeusEx.u.patch
      ```

      - `xxd -c1` dumps the files into hexadecimal text values, one byte per line
      - `comm -13` shows only the lines in the second file that differ from the first file

To apply the patch:

```
xxd -c1 -r DeusEx.u.patch ~/.steam/steam/steamapps/common/Deus\ Ex/System/DeusEx.u
```

#### Editing textures

1. Open UTPT

1. Change export location

1. Export texture as BMP

   - Just export the first texture

1. Open texture with GIMP

1. Select hands

1. Invert selection

1. _Colors_ > _Colorize_

1. Turn down _Saturation_ all the way

1. Turn down _Lightness_ as far as desired

1. _Colors_ > _Brightness-Contrast_ > turn Brightness all the way down > _OK_

1. Repeat last step as many times as desired

#### Install SDK

1. Get SDK

   https://community.pcgamingwiki.com/files/file/237-deus-ex-sdk/

1. Get get UnrealEdFix4.exe

   http://www.nerfarena.de.vu/files/UnrealEdFix4.exe

1. Install SDK and prerequisites

   ```
   STEAM_COMPAT_DATA_PATH="/home/$USER/.local/share/Steam/steamapps/compatdata/6910" STEAM_COMPAT_CLIENT_INSTALL_PATH="/home/$USER/.local/share/Steam" "$HOME/.local/share/Steam/steamapps/common/Proton 7.0"/proton waitforexitandrun DeusExSDK1112f.exe
   protontricks 6910 vb5run
   STEAM_COMPAT_DATA_PATH="/home/$USER/.local/share/Steam/steamapps/compatdata/6910" STEAM_COMPAT_CLIENT_INSTALL_PATH="/home/$USER/.local/share/Steam" "$HOME/.local/share/Steam/steamapps/common/Proton 7.0"/proton waitforexitandrun UnrealEdFix4.exe
   ```

1. Open UnrealEd

   ```
   STEAM_COMPAT_DATA_PATH="/home/$USER/.local/share/Steam/steamapps/compatdata/6910" STEAM_COMPAT_CLIENT_INSTALL_PATH="/home/$USER/.local/share/Steam" "$HOME/.local/share/Steam/steamapps/common/Proton 7.0"/proton waitforexitandrun "$HOME/.steam/steam/steamapps/common/Deus Ex/System/UnrealEd.exe"
   ```
