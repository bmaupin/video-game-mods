// Requires at least Node 10 for fs/promises
// To run:
// npx ts-node src/patch-bioshock-infinite.ts ~/.steam/steam/steamapps/common/BioShock\ Infinite/XGame/CookedPCConsole_FR/WorldTextures2.tfc 267881188 18733

// @ts-ignore
import { resolve } from 'path';

import Ue3Package from './Ue3Package';

const main = async () => {
  if (process.argv.length !== 3) {
    console.log('Error: Missing required arguments');
    console.log(
      `Usage: ${process.argv[0]} ${process.argv[1]} /path/to/BioShock Infinite`
    );
    process.exit(1);
  }

  const gameDirectory = process.argv[2];

  // First level (lighthouse)
  await patchTextureMasks(gameDirectory, 'S_Light_Geo.xxx', [
    'BloodPool_MASK',
    'BloodSmear_MASK',
  ]);
  await patchTextureMasks(gameDirectory, 'S_Light_P.xxx', ['BloodSplat_MASK']);

  // Town raffle; work in progress
  await patchTextureMasks(gameDirectory, 'S_TWN_Lottery_Game2.xxx', [
    'Blood_MASK',
    'BloodDecal_MASK',
    'BloodMist_MASK',
    'BloodSpray_MASK',
    // 'DecapBloodRibbon_MASK',
    // 'headgore_MASK',
    'LottoCopGoreB_MASK',
    'Skyhook_FaceHit_Blood_1_Mask',
    'Skyhook_FaceHit_Blood_2_Mask',
  ]);
};

const patchTextureMasks = async (
  gameDirectory: string,
  packageFile: string,
  texturesToPatch: string[]
) => {
  // TODO
  // const PACKAGE_SUBDIRECTORY = 'XGame/CookedPCConsole_FR';
  const PACKAGE_SUBDIRECTORY = 'XGame/CookedPCConsole_FR/unpacked';

  const unrealPackage = await Ue3Package.fromFile(
    resolve(__dirname, gameDirectory, PACKAGE_SUBDIRECTORY, packageFile)
  );
  for (const textureToPatch of texturesToPatch) {
    console.log(`Patching texture ${textureToPatch}`);
    await unrealPackage.getTexture2D(textureToPatch).blackOutTexture();
  }
};

main().catch((error) => {
  console.error(error);
});
