# Modding Deus Ex 1

#### Identifying textures

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

#### Change a texture used by a model

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

1. Change the texture

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
