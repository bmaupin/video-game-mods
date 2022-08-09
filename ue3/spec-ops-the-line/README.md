#### Changing configs with the Windows build

1. Download inicrypt.zip

   https://community.pcgamingwiki.com/files/file/1880-spec-ops-the-line-ini-decryptencrypt-tools-inicryptzip/

1. Extract inicrypt.zip

   unzip inicrypt.zip

cd ~/.steam/steam/steamapps/compatdata/50300/pfx/drive_c/users/steamuser/Documents/My\ Games/SpecOps-TheLine/SRGame/Config/

wine ~/Desktop/Gibbed.SpecOpsTheLine.IniDecrypt.exe SREngine.ini

## < MotionBlur=True

> MotionBlur=False
> 1915c1915

## < UseHighQualityBloom=True

> UseHighQualityBloom=False

wine ~/Desktop/Gibbed.SpecOpsTheLine.IniEncrypt.exe SREngine.ini

wine ~/Desktop/Gibbed.SpecOpsTheLine.IniDecrypt.exe SRInput.ini

## < bEnableMouseSmoothing=true

> bEnableMouseSmoothing=false
> 619c619

## < m_viewAccelEnabled=true

> m_viewAccelEnabled=false

wine ~/Desktop/Gibbed.SpecOpsTheLine.IniEncrypt.exe SRInput.ini
