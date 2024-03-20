# Sid Meier's Alpha Centauri

## Audio crackling

The audio crackles when playing in Steam with Proton. The fix here seems to work: https://www.gog.com/forum/sid_meier_s_alpha_centauri_/fix_for_static_sound

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

   - Enable _Do or Die_ (Don't restart eliminated players)
   - TODO: test _Time Warp_

## Map sizes

ⓘ One of the most important factors in the length of a 4X game is the size of the map. This has its own section as it's a bit more complicated in Alpha Centauri.

#### Map sizes explained

Alpha Centauri's map sizes are a bit confusing due to the map being rotated by 45°. Map sizes are controlled by two parameters:

- Horizontal
  - This is the width of the map. The map will appear to be this many tiles wide, but the actual number of tiles in the map will be doubled to account for the map being rotated 45°.
  - For example, a map with a horizontal value of 16 will appear to be 16 tiles wide at a glance but will actually be 32 tiles wide.
- Vertical
  - The height of the map. Unlike horizontal, the vertical value is the actual number of tiles in the map, so the map will appear to be half as high as the vertical value.
  - For example, a map with a vertical value of 16 will appear to be 8 tiles high at a glance but will actually be 16 tiles high.

Beyond this, tiles appear to be wider than they are taller. So even a map size that is technically square (e.g. 32x16) will appear to be much wider than it is taller.

#### Choose a custom map size without modding

ⓘ This is the easiest way to use a custom map size but you will be limited to a 16x16 map. See below if you wish to create a smaller map.

When starting the game, you can choose a custom map size:

1. At the main menu, choose _Start Game_ > _Make Random Map_ > _Custom Size_

1. Set _Horizontal_ and _Vertical_ to a value equal to or greater than 16

   👉 Any value less than 16 will automatically be set to 16. For example, if you try to create a 10x20 map, the game will create a 16x20 map.

#### Default map sizes

The default map sizes are quite large (from `alpha.txt` in the game's root directory, under `WORLDSIZE`):

| Description                  | Size   | Total tiles |
| ---------------------------- | ------ | ----------- |
| Tiny planet (early conflict) | 24x48  | 1152        |
| Small planet                 | 32x64  | 2048        |
| Standard planet              | 40x80  | 3840        |
| Large planet                 | 44x90  | 3960        |
| Huge planet (late conflict)  | 64x128 | 8192        |

#### Test results

- 8x16
  - 4 total factions, 3 others listed as "eliminated"
    - TODO: what does eliminated mean?

#### Ideas for smaller map sizes

- Duel
  - 8x16 = 128 tiles
  - 9x18 = 162 tiles
- Tiny
  - 11x22 = 242 tiles
  - 12x24 = 288 tiles
- Small
  - 14x28 = 392 tiles

#### Add custom world sizes

Edit `alpha.txt` in the game's root directory, e.g.

(TODO: test these, adjust names and sizes as needed)

```
#WORLDSIZE
10
Duel planet,                  8,  16
Super tiny planet,            11, 22
Super small planet,           14, 28
Speed transcendence planet,   16, 16
Speed transcendence wide,     16, 32
Tiny planet|(early conflict), 24, 48
Small planet,                 32, 64
Standard planet,              40, 80
Large planet,                 44, 90
Huge planet|(late conflict),  64, 128
```
