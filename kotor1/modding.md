# Modding KOTOR

ⓘ The steps here apply to KOTOR 1 and 2

#### Identify textures to replace

1. Install xoreos-tools (provides `convert2da`, `unerf`, `unkeybif`, `xoreostex2tga`)

   ```
   sudo apt install xoreos-tools
   ```

1. List contents of texture pack, e.g.

   ```
   unerf l ~/.steam/steam/steamapps/common/Knights\ of\ the\ Old\ Republic\ II/steamassets/texturepacks/swpc_tex_tpa.erf | less
   ```

   - Prefixes

     <!-- prettier-ignore -->
     - Location-specific textures
        - *DAN_*: Dantooine textures
        - *EBO_*: Ebon Hawk
        - *NAR_*: Nar Shadaa
        - *TEL_*: Telos
        - ... etc
     - *i_*: items
     - *n_*: NPCs
     - *p_*: playable/party characters
     - *PFB*: female bodies
     - *PFH*: female heads
     - *PMB*: male bodies
     - *PMH*: male heads
     - *v_*: vehicles
     - *w_*: weapons

1. Extract the desired file, e.g.

   ```
   unerf s ~/.steam/steam/steamapps/common/Knights\ of\ the\ Old\ Republic\ II/steamassets/texturepacks/swpc_tex_tpa.erf N_HandSis.tpc
   ```

   Or to extract multiple files:

   ```
   for filename in $(unerf l ~/.steam/steam/steamapps/common/Knights\ of\ the\ Old\ Republic\ II/steamassets/texturepacks/swpc_tex_tpa.erf | grep -i PFB | awk '{print $1}'); do unerf s ~/.steam/steam/steamapps/common/Knights\ of\ the\ Old\ Republic\ II/steamassets/texturepacks/swpc_tex_tpa.erf "$filename"; done
   ```

1. Convert texture to TGA, e.g.

   ```
   xoreostex2tga N_HandSis.tpc N_HandSis.tga
   ```

   Or to convert multiple textures and remove the .tpc files:

   ```
   for filename in *.tpc; do xoreostex2tga "$filename" "${filename}.tga"; rm "$filename"; done
   ```

#### Change the texture used by a model

1. Extract appearance.2da

   (Skip this step for KOTOR 2 TSLRCM; just copy the file from here: `~/.steam/steam/steamapps/workshop/content/208580/485537937/override/appearance.2da`)

   1. Extract appearance.2da, e.g. for KOTOR 2 vanilla:

      ```
      unkeybif e ~/.steam/steam/steamapps/common/Knights\ of\ the\ Old\ Republic\ II/steamassets/chitin.key ~/.steam/steam/steamapps/common/Knights\ of\ the\ Old\ Republic\ II/steamassets/data/2da.bif
      ```

   1. Delete other 2da files in the current directory:

      ```
      find . -maxdepth 1 -name "*.2da" ! -name appearance.2da -exec rm {} \;
      ```

1. Convert appearance.2da to a text file, e.g.

   ```
   convert2da ~/.steam/steam/steamapps/workshop/content/208580/485537937/override/appearance.2da > appearance.2da.txt
   ```

1. Modify appearance.2da as desired

   - The first column (`label`) is the name of the texture
   - The `model`\* columns are the models used
   - The `tex`\* columns are the textures used

   1. Find the replacement texture in the text file

      - The name should closely correspond to the texture file, e.g. `N_CommF` corresponds to `N_CommF01.tpc.tga`

   1. Make a note of the values in the `model` and `tex` columns (textures correspond with a specific model)

   1. Find the texture to replace in the text file

   1. Replace the `model` and `tex` columns with the values you noted earlier

1. Convert the appearance.2da.txt back to binary

   ```
   convert2da --2dab appearance.2da.txt > appearance.2da
   ```

1. To use the new `appearance.2da` file, copy it into the proper location

   - KOTOR 1: see [here](README.md)
   - KOTOR 2: see [here](../kotor2/README.md)
