# Spec Ops: The Line

#### Changing configs with the Windows build

(The Linux build seems to hang on Chapter 5, so using Proton is recommended)

1. Download inicrypt.zip

   https://community.pcgamingwiki.com/files/file/1880-spec-ops-the-line-ini-decryptencrypt-tools-inicryptzip/

1. Extract inicrypt.zip

   ```
   unzip inicrypt.zip
   ```

1. Make changes to SREngine.ini to disable motion blur

   1. Decrypt the file

      ```
      cd ~/.steam/steam/steamapps/compatdata/50300/pfx/drive_c/users/steamuser/Documents/My\ Games/SpecOps-TheLine/SRGame/Config/

      wine ~/Desktop/Gibbed.SpecOpsTheLine.IniDecrypt.exe SREngine.ini
      ```

   1. Change `MotionBlur=True` to `MotionBlur=False`

   1. Change `UseHighQualityBloom=True` to `UseHighQualityBloom=False`

   1. Encrypt the file

      ```
      wine ~/Desktop/Gibbed.SpecOpsTheLine.IniEncrypt.exe SREngine.ini
      ```

1. Make changes to SRInput.ini to disable mouse acceleration

   1. Decrypt the file

      ```
      wine ~/Desktop/Gibbed.SpecOpsTheLine.IniDecrypt.exe SRInput.ini
      ```

   1. Change `bEnableMouseSmoothing=true` to `bEnableMouseSmoothing=false`

   1. Change `m_viewAccelEnabled=true` to `m_viewAccelEnabled=false`

   1. Encrypt the file

      ```
      wine ~/Desktop/Gibbed.SpecOpsTheLine.IniEncrypt.exe SRInput.ini
      ```

#### Disable intro videos

Change Steam [Launch Options](https://help.steampowered.com/faqs/view/7D01-D2DD-D75E-2955) to

```
%command% -nosplash -nostartupmovies
```
