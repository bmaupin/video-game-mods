# Star Wars: Knights of the Old Republic II

## Performance

#### Low frame rate fix

[https://www.pcgamingwiki.com/wiki/Star_Wars:\_Knights_of_the_Old_Republic_II\_-_The_Sith_Lords#Low_performance](https://www.pcgamingwiki.com/wiki/Star_Wars:_Knights_of_the_Old_Republic_II_-_The_Sith_Lords#Low_performance)

```
sed -i 's/DisableVertexBufferObjects=1/Disable Vertex Buffer Objects=1/' ~/.steam/steam/steamapps/common/Knights\ of\ the\ Old\ Republic\ II/steamassets/swkotor2.ini
```

## Content mod

Mod to make it more family-friendly by updating clothing for some characters

#### Installation

- KOTOR 2 vanilla

  Copy vanilla/appearance.2da to steam/SteamApps/common/Knights of the Old Republic II/steamassets/override/

- KOTOR 2 TSLRCM

  Copy tslrcm/appearance.2da to steam/SteamApps/workshop/content/208580/485537937/override/, e.g. for Proton:

  ```
  cp kotor2/tslrcm/appearance.2da ~/.steam/steam/steamapps/workshop/content/208580/485537937/override/
  ```

#### Removal

- KOTOR 2 vanilla

  Delete steam/SteamApps/common/Knights of the Old Republic II/steamassets/override/appearance.2da

- KOTOR 2 TSLRCM

  Copy tslrcm/appearance.2da.dist to steam/SteamApps/workshop/content/208580/485537937/override/appearance.2da
