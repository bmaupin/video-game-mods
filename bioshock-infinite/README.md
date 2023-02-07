# Patch for BioShock Infinite to reduce gore

## Status

Proof of concept. [Removed most blood from the intro (lighthouse) level](docs/screenshot-lighthouse.jpg). Started working on the raffle.

## Background

BioShock Infinite used to have an option to reduce the gore ([source](https://www.pcgamesn.com/bioshock-infinites-video-and-graphics-options-full), [source](https://www.reddit.com/r/Bioshock/comments/1clpwx/pc_file_discoveries_cut_content/)) which was removed at release time.

This was an attempt to see how far I could get to create a patch to reduce the gore, but in the end it didn't seem worth all the effort.

## To do

- [x] Naïve Unreal package reader
- [x] Add support for Texture2D objects
- [x] Add functionality to black out mipmaps in TFC files
- [ ] Add support for blacking out mipmaps in Unreal package files
- [ ] Add support for compressed Unreal package files

## Usage

1. Extract the package files manually

   Since this doesn't support compressed package files right now, they need to be extracted manually first

   1. Download [Unreal Package Decompressor](https://www.gildor.org/downloads)

   1. Extract the package files

      ```
      cd ~/.steam/steam/steamapps/common/BioShock\ Infinite/XGame/CookedPCConsole_FR/
      wine path/to/decompress.exe S_Light_Geo.xxx
      wine path/to/decompress.exe S_Light_P.xxx
      wine path/to/decompress.exe S_TWN_Lottery_Game2.xxx
      ```

1. Apply the patches

   ```
   npm i
   npx ts-node src/patch-bioshock-infinite.ts ~/.steam/steam/steamapps/common/BioShock\ Infinite/
   ```

1. Remove the decompressed files

   ```
   cd ~/.steam/steam/steamapps/common/BioShock\ Infinite/XGame/CookedPCConsole_FR/
   rm -rf unpacked/
   ```
