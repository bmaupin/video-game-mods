Mods and configs for various video games

## Performance

#### General performance tips

1. Turn down graphical settings in the game all the way

1. Check [PCGamingWiki](https://www.pcgamingwiki.com) for performance tweaks

1. Turn down the resolution

   - If you have a small screen (e.g. a laptop) this allows you to use full screen and turn down the resolution quite a bit
   - Integrated Intel graphics will need to be turned down to at least 720p for most games made since 2015, and some games need to be turned down even more (e.g. 540p)

   ⓘ Some games offer adaptive resolution/resolution scaling, but in my experience these typically perform much worse than just turning down the resolution

1. Lock resolution to 30 FPS

   For games where this isn't an option in the graphical settings, you can cap the FPS like this if you're using Proton:

   ```
   DXVK_FRAME_RATE=30 %command%
   ```

#### Game engine performance tips

I've had very little success getting any significant performance increase from most game engines I've tried (UE4, Void engine), but you may be able to get single-digit FPS increases by tweaking game engine settings, which vary by engine.

Sometimes you can also get parameters to tweak by scanning the game binary directly, e.g.

```
$ strings ~/.steam/steam/steamapps/common/Prey\ Demo/Binaries/Danielle/x64/Release/Prey.exe | grep -i ^r_.... | sort -u | head
r_3MonHack
r_3MonHackHUDFOVX
r_3MonHackHUDFOVY
r_3MonHackLeftCGFOffsetX
r_3MonHackRightCGFOffsetX
r_AllowLiveMoCap
r_AntialiasingMode
r_AntialiasingModeDebug
r_AntialiasingModeSCull
r_AntialiasingTAAFalloffHiFreq
```

ⓘ Make sure you also use `strings -e l` to get any UTF-16 strings, e.g.

```
strings -e l Game.exe | egrep ^b | sort -u | head -n 3
bAdaptiveTraining
bAllowAltTabToSwitchBetweenWindowedAndFullscreen
bAllowDownsampledTranslucency
```

#### Proton performance tips

1. Try a newer version of Proton

1. Try [Proton GE](https://github.com/GloriousEggroll/proton-ge-custom)

   - Proton GE 7 or earlier in particular is useful if you end up having to set the game to a low resolution as it has FSR enabled out of the box, which will upscale with relatively little to no performance impact.

1. Try [`DXVK_ASYNC=1`](https://github.com/GloriousEggroll/proton-ge-custom#modification)

   (Requires Proton GE, version 7.44 or earlier as it was removed from Proton GE 7.45+)

1. Use game mode

   ⚠ I've actually seen game mode significantly reduce FPS in at least one game. Make sure to try with and without game mode to see if it helps.

   1. Set the game launch properties to `gamemoderun %command%`

      If you see this error:

      ```
      gamemodeauto: dlopen failed - libgamemode.so: cannot open shared object file: No such file or directory
      ```

      Try this instead: `LD_PRELOAD="$LD_PRELOAD:/usr/\$LIB/libgamemode.so.0" gamemoderun %command%`

   1. Tweak game mode

      See [https://github.com/FeralInteractive/gamemode#configuration](https://github.com/FeralInteractive/gamemode#configuration)

1. Check [ProtonDB](https://www.protondb.com/) to see if there are any tips on improving performance

1. Check the [Github Proton repository](https://github.com/ValveSoftware/Proton/issues) to see if there's an issue for the game that might have suggestions on improving performance

1. Check logs

   Quit Steam and then run `steam` in a terminal to see the logs

1. (Intel graphics) Enable performance support

   Run this before launching the game:

   ```
   sudo sysctl dev.i915.perf_stream_paranoid=0
   ```

   If it helps, see here to make the change permanent: [https://wiki.archlinux.org/title/intel_graphics#Enable_performance_support](https://wiki.archlinux.org/title/intel_graphics#Enable_performance_support)

1. Install fsync-compatible kernel

   Make sure you're using kernel 5.16 or later

1. Try an older version of DirectX

   e.g. [`PROTON_NO_D3D12=1`](https://github.com/GloriousEggroll/proton-ge-custom#modification) (Proton GE only), `PROTON_NO_D3D11=1`, etc.

1. See more tips here: [https://www.protondb.com/help/improving-performance](https://www.protondb.com/help/improving-performance)
