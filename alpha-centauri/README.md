# Sid Meier's Alpha Centauri

## Audio crackling

The audio crackles when playing in Steam with Proton. The fix here seems to work: https://www.gog.com/forum/sid_meier_s_alpha_centauri_/fix_for_static_sound

The script has also been added here for purposes of preservation: [sound_fix.sh](sound_fix.sh)

## Tips for faster gameplay

ⓘ As with most 4X games, games of Alpha Centauri can be very long. These are some notes at attempts to make the game quicker.

#### Keyboard shortcuts

One of the best way to make the game go quicker is to use keyboard shortcuts.

- Enter: ending the turn, choosing the default selection for most popups
- Shift-A: automate (formers, etc)
- /: explore automatically (scouts, etc)

#### Game options

1. When starting a game, choose _Customize Rules_

1. Use these options for potentially faster gameplay:

   - Enable _One for All_ (Allow cooperative victory, this is enabled by default)
   - Enable _Do or Die_ (Don't restart eliminated players)
   - Enable _Time Warp_ (Accelerated start, gives extra units and bases on the first turn)

## Map sizes

ⓘ One of the most important factors in the length of a 4X game is the size of the map. This has its own section as it's a bit more complicated in Alpha Centauri.

⚠️ Unless otherwise noted, all map sizes in this document use the same format that the game itself uses, e.g. a 16x16 map will contain 32 horizontal and 16 vertical tiles. Read below for more information.

#### Map sizes explained

Alpha Centauri's map sizes are a bit confusing due to the map being rotated by 45°. Map sizes are controlled by two parameters:

- Horizontal
  - This is the width of the map. The map will appear to be this many tiles wide, but the actual number of tiles in the map will be doubled to account for the map being rotated 45°.
  - For example, a map with a horizontal value of 16 will appear to be 16 tiles wide at a glance but will actually be 32 tiles wide.
- Vertical
  - The height of the map. Unlike horizontal, the vertical value is the actual number of tiles in the map, so the map will appear to be half as high as the vertical value.
  - For example, a map with a vertical value of 16 will appear to be 8 tiles high at a glance but will actually be 16 tiles high.

Beyond this, tiles appear to be wider than they are taller. So even a map size that is technically square (e.g. 32x16) will appear to be much wider than it is taller.

#### Use a custom map size without modding

ⓘ This is the easiest way to use a custom map size but you will be limited to a 16x16 map. See below if you wish to create a smaller map.

When starting the game, you can choose a custom map size:

1. At the main menu, choose _Start Game_ > _Make Random Map_ > _Custom Size_

1. Set _Horizontal_ and _Vertical_ to a value equal to or greater than 16

   👉 Any value less than 16 will automatically be set to 16. For example, if you try to create a 10x20 map, the game will create a 16x20 map.

#### Add custom world sizes

ⓘ This is the only way to get map sizes smaller than 16x16

👉 Some of these maps are so small, the game may immediately end when started. Simply try again (choose _Quick Start_ to start a new game with the same settings as the previous game).

1. Back up `alpha.txt` in the game's root directory

1. Open `alpha.txt` and find the section beginning with `#WORLDSIZE`

1. Edit the section as desired

   For example, these are the smallest viable world sizes based on my testing (see below for more information):

   ```
   #WORLDSIZE
   6
   10x16 320 tiles 2-3 factions, 10, 16
   12x14 336 tiles 2-3 factions, 12, 14
   12x16 384 tiles 2-3 factions, 12, 16
   14x14 392 tiles 2-3 factions, 14, 14
   14x16 448 tiles 2-4 factions, 14, 16
   16x14 448 tiles 2-4 factions, 16, 14
   ```

   ⚠️ Make sure the number under `#WORLDSIZE` matches the number of world sizes in the list

#### Default map sizes

The default map sizes are quite large (from `alpha.txt` in the game's root directory, under `WORLDSIZE`):

| Description                  | Size   | Total tiles |
| ---------------------------- | ------ | ----------- |
| Tiny planet (early conflict) | 24x48  | 2304        |
| Small planet                 | 32x64  | 4096        |
| Standard planet              | 40x80  | 7680        |
| Large planet                 | 44x90  | 7920        |
| Huge planet (late conflict)  | 64x128 | 16384       |

#### Measuring the map size

This is one way to measure the map size when testing:

1. After starting the game, select a unit that can move (e.g. a scout)

1. Left-click on the unit and drag the mouse cursor around the map to find the highest map coordinate values

1. Since each coordinate starts with 0 on the first tile, add 1 to each coordinate to get the size of the map

1. Divide the X coordinate by 2 to get the "Horizontal" value of the map (as you would use in the game UI or alpha.txt)

For example, if the largest map coordinate is 31,15, the map is 16x16 (16 horizontal, 16 vertical)

#### Testing various map sizes

(The scenario editor was used to determine which other factions were on the map)

| Map size¹ | Game crashed² | Game ended³ | Normal game⁴ | Number of factions⁵ | Tiles |
| --------- | ------------- | ----------- | ------------ | ------------------- | ----- |
| 5x20      |               | X           |              |                     |       |
| 6x18      |               | X (80%)     | X (20%)      | 2                   | 216   |
| 6x20      |               | X (70%)     | X (30%)      | 2-3                 | 240   |
| 6x22      |               | X (65%)     | X (35%)      | 2-3                 | 264   |
| 8x8       | X             |             |              |                     |       |
| 8x10      | X             |             |              |                     |       |
| 8x12      | X             |             |              |                     |       |
| 8x14      |               | X           |              |                     |       |
| 8x16      |               | X           |              |                     |       |
| 8x18      |               | X           |              |                     |       |
| 10x10     | X             |             |              |                     |       |
| 10x12     | X             |             |              |                     |       |
| 10x14     |               | X (80%)     | X (20%)      | 2                   | 280   |
| 10x16     |               | X (40%)     | X (60%)      | 2-3                 | 320   |
| 12x12     | X             |             |              |                     |       |
| 12x14     |               | X (50%)     | X (50%)      | 2-3                 | 336   |
| 12x16     |               | X (20%)     | X (80%)      | 2-3                 | 384   |
| 14x14     |               | X (20%)     | X (80%)      | 2-3                 | 392   |
| 14x16     |               |             | X            | 2-4                 | 448   |
| 16x14     |               |             | X            | 2-4                 | 448   |
| 16x16     |               |             | X            | 2-4                 | 512   |

**Notes:**

ⓘ Some map sizes had different test results when tested multiple times. This is probably due to variations in the map generation. For example, the more water a map has, the less room it has for factions and the fewer the number of factions on the map.

1. As explained above, this is the map size used by Alpha Centauri (e.g. the number of horizontal tiles is double what's listed)
2. The game immediately crashed. My suspicion is that the map didn't have enough land for any factions, including the player.
3. The game ended as soon as it was started. This seems to happen when the map only has enough land for the player faction.
4. The game continued as normal. My suspicion is this means the map had enough room for at least two factions (including the player).
5. The total number of factions, including the player.
