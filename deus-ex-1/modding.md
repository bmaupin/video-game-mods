# Modding Deus Ex 1

ⓘ These docs are for very basic mods where a property is changed in an Unreal package file to point to a different object, e.g. for changing a texture, sound, etc.

#### Identifying textures

- UE Viewer

  UE Viewer can be used to quickly browse all textures in a package

  1. Download [UE Viewer](https://www.gildor.org/en/projects/umodel)

     ⓘ The Linux version relies on a very old version of libpng, but the Windows version works fine in Wine

  1. Open UE Viewer, e.g.

     ```
     wine umodel.exe
     ```

  1. Browse to the Deus Ex/System directory

     e.g. Z:\home\user\.steam\steam\steamapps\common\Deus Ex\System\

  1. Click _OK_ and then open DeusExCharacters.u

  1. Browse the textures using PgUp/PgDn

- [UTPT](https://www.acordero.org/projects/unreal-tournament-package-tool/) (Unreal Tournament Package Tool)

  1. Download [UTPT](https://www.acordero.org/projects/unreal-tournament-package-tool/) (Unreal Tournament Package Tool)

  1. Open UTPT, e.g.

     ```
     wine UTPT.exe
     ```

  1. Open Deus Ex/System/DeusExCharacters.u

  1. In the _Export Tree_ pane on the left, scroll down to the _Skins_ package

  1. Find the skin whose texture you'd like to see, right-click > _View Texture_

#### Change a texture used by a model

1. Make a copy of DeusEx.u

   ```
   cp -av DeusEx.u DeusEx.u.bak
   ```

1. Download [UTPT](https://www.acordero.org/projects/unreal-tournament-package-tool/) (Unreal Tournament Package Tool)

1. Open UTPT, e.g.

   ```
   wine UTPT.exe
   ```

1. Open Deus Ex/System/DeusEx.u

1. It should show the _Export Tree_ tab on the left by default. Right-click in the pane > _Full Collapse_

1. Click the _Super_ column to sort and find the classes whose models you want to change (e.g. classes starting with `Human`)

1. Right-click the class you'd like to change (e.g. WalterSimons) > _View Object Properties_

1. In the _Properties_ dialogue on the right, find the texture you'd like to replace and get the value

   e.g. WaltonSimonsTex1 = `-1188`

1. Convert value from Unreal compact index format using this site: [https://bunnytrack.net/ut-package-format/#compact-index-format](https://bunnytrack.net/ut-package-format/#compact-index-format)

   e.g. `-1188` = `0xE412`

1. Get offset of property to replace

   1. Right-click the object in the left pane > _Analize Raw Object_

   1. In the right pane click _Format_ > _Auto format_

   1. Shrink the left pane if needed to see all columns (0 through F) at the top

   1. Mouse over each value until you find the property you want to replace

   1. Click the first byte to replace and note the _Offset in Package_ (at the bottom) to get the exact binary offset to replace

      e.g. 0x000525c6

1. Get the value of the new property to replace it with

   e.g. TrenchShirtTex1 = `-793` = `D9 0C`

1. Update [patch-deusex.ts](patch-deusex.ts) with the changes

#### Mask all or part of textures

1. Identify the texture using the steps above

1. Open the file containing the texture with UTPT (e.g. System/DeusExCharacters.u)

1. In the _Export Tree_ pane on the left, right-click the texture > _Analize Raw Object_

1. If the UTPT window is maximised, double-click the title-bar to un-maximise it (otherwise UTPT may crash)

1. In the right pane click _Format_ > _Auto format_

1. In the right pane, click the first yellow byte (this is the first byte of the image data of the first mipmap)

1. Note the _Offset in Package_ (at the bottom) to get the exact starting binary offset

   e.g. 0x00426b58

1. Optionally determine an area to exclude from the mask

   1. In UTPT, go to _File_ > _Options_ > _Extracting_ and set _Base Directory_ to the directory where you'd like the textures extracted

   1. Right-click the texture in the left pane in UTPT > _Extract as Image_ > _First MipMap as BMP_

   1. Open the exported texture in an image editor (e.g. GIMP) and make a note of the start and end coordinates to exclude from the mask

1. Update [patch-deusex.ts](patch-deusex.ts) with the changes
