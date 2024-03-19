# Sid Meier's Alpha Centauri

ⓘ As with most 4X games, games of Alpha Centauri can be very long. These are some notes at attempts to make the game quicker.

## Audio crackling

The audio crackles when playing in Steam with Proton. The fix here seems to work: https://www.gog.com/forum/sid_meier_s_alpha_centauri_/fix_for_static_sound

## Game options

1. When starting a game, choose _Customize Rules_

1. Use these options for potentially faster gameplay:

   - Enable _Do or Die_ (Don't restart eliminated players)
   - TODO: test _Time Warp_

## Map sizes

When starting the game, you can choose a custom map size:

1. At the main menu, choose _Start Game_ > _Make Random Map_ > _Custom Size_

   - The minimum map size appears to be 8x16 (height x width). If anything lower than this is set, an 8x16 map will be created.
     - TODO: What if only one of the values picked is smaller, e.g. try 10 height x 10 width.
     - TODO: Is there a way to mod the game or map script to allow smaller sizes?

#### Default map sizes

(From `alpha.txt` in the game's root directory, under `WORLDSIZE`)

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
