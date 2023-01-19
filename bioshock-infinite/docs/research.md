#### High-level

- "Heavily-modified" Unreal Engine 3
- Assets stored in BioShock Infinite/XGame/CookedPCConsole_FR/
- Unreal package files have `.xxx` extension
- Many assets stored in level-specific files with `S_` prefix
  - e.g. `S_Light`... = lighthouse (intro level)
  - You can get the level name by looking at the most recent file in the save directory (~/.steam/steam/steamapps/compatdata/8870/pfx/drive_c/users/steamuser/My Documents/My Games/BioShock Infinite/XGame/SaveData/SaveData/)

#### Tools

- Umodel
- UE Explorer

#### UE3 Texture File Cache (`.tfc`) files

- Official documentation: [UDK | Content Cooking](https://docs.unrealengine.com/udk/Three/ContentCooking.html)
- https://www.gildor.org/smf/index.php/topic,297.0.html
- https://www.gildor.org/smf/index.php?topic=1635.0
- https://zenhax.com/viewtopic.php?t=8648
- Code
  - https://github.com/gildor2/UEViewer/blob/f6c2294366cf18bbd2428cdadd2a4b0d9ecff8d3/Unreal/UnrealPackage/UnPackageReader.cpp#L410
  - https://github.com/wghost/UPKUtils/blob/master/UPKInfo.cpp

#### Steps

1. Go through package (`.xxx`) files to find which ones contain potential content to modify

   e.g.

   ```
   for file in *.xxx; do echo; echo "$file"; umodel -list "$file" | grep -i blood; done > blood.txt
   ```

1. Look through package (`.xxx`) files to find textures to modify

   - View the whole package

     ```
     umodel -view S_Light_Geo.xxx
     ```

   - View a specific texture

     ```
     umodel -view S_Light_Geo.xxx BloodPool_MASK
     ```

1. Get texture information

   ```
   umodel -dump S_Light_Geo.xxx BloodPool_MASK
   ```

   - This will tell us the format of the texture (e.g. `PF_DXT1`)

1. Export textures using umodel

   e.g. to export a DXT1 texture:

   ```
   umodel -export -dds S_Light_Geo.xxx BloodPool_MASK
   ```

   - This will export the texture from WorldTextures2.tfc; to export the texture from S_Light_Geo.xxx, move WorldTextures2.tfc first, e.g.

     ```
     mv WorldTextures2.tfc WorldTextures2.tfc.bak
     umodel -export -dds S_Light_Geo.xxx BloodPool_MASK
     ```

   - The package file will contain the raw image data; exporting it from umodel will add an 0x80 byte DDS header so the image can be opened e.g. with GIMP

   - The uncompressed package file will contain the uncompressed raw image

## Patches

#### Lighthouse

BloodPool_MASK (S_Light_Geo.xxx -> WorldTextures2.tfc)

```
npx ts-node src/patch-tfc.ts ~/.steam/steam/steamapps/compatdata/2425643771/pfx/drive_c/GOG\ Games/BioShock\ Infinite/XGame/CookedPCConsole_FR/WorldTextures2.tfc 267881188 18733
npx ts-node src/patch-tfc.ts ~/.steam/steam/steamapps/compatdata/2425643771/pfx/drive_c/GOG\ Games/BioShock\ Infinite/XGame/CookedPCConsole_FR/WorldTextures2.tfc 267874223 6965
npx ts-node src/patch-tfc.ts ~/.steam/steam/steamapps/compatdata/2425643771/pfx/drive_c/GOG\ Games/BioShock\ Infinite/XGame/CookedPCConsole_FR/WorldTextures2.tfc 267871484 2739
```

BloodSmear_MASK (S_Light_Geoxxx -> WorldTextures2.tfc)

```
npx ts-node src/patch-tfc.ts ~/.steam/steam/steamapps/compatdata/2425643771/pfx/drive_c/GOG\ Games/BioShock\ Infinite/XGame/CookedPCConsole_FR/WorldTextures2.tfc 268224534 27246
npx ts-node src/patch-tfc.ts ~/.steam/steam/steamapps/compatdata/2425643771/pfx/drive_c/GOG\ Games/BioShock\ Infinite/XGame/CookedPCConsole_FR/WorldTextures2.tfc 268216356 8178
npx ts-node src/patch-tfc.ts ~/.steam/steam/steamapps/compatdata/2425643771/pfx/drive_c/GOG\ Games/BioShock\ Infinite/XGame/CookedPCConsole_FR/WorldTextures2.tfc 268213617 2739
```

BloodSplat_MASK (S_Light_P.xxx -> WorldTextures1.tfc)

```
npx ts-node src/patch-tfc.ts ~/.steam/steam/steamapps/compatdata/2425643771/pfx/drive_c/GOG\ Games/BioShock\ Infinite/XGame/CookedPCConsole_FR/WorldTextures1.tfc 4115589 25711
npx ts-node src/patch-tfc.ts ~/.steam/steam/steamapps/compatdata/2425643771/pfx/drive_c/GOG\ Games/BioShock\ Infinite/XGame/CookedPCConsole_FR/WorldTextures1.tfc 4108610 6979
```