// Requires at least Node 10 for fs/promises
// To run:
// npx ts-node src/patch-tfc.ts ~/.steam/steam/steamapps/compatdata/2425643771/pfx/drive_c/GOG\ Games/BioShock\ Infinite/XGame/CookedPCConsole_FR/WorldTextures2.tfc 267881188 18733

import { readFile, writeFile } from 'fs/promises';
// @ts-ignore
import lzo from 'lzo';
import { resolve } from 'path';
import invariant from 'tiny-invariant';

// @ts-ignore
import UTReader from '../lib/UTReader';

const main = async () => {
  if (process.argv.length !== 3) {
    console.log('Error: Missing required arguments');
    console.log(
      `Usage: ${process.argv[0]} ${process.argv[1]} /path/to/BioShock Infinie`
    );
    process.exit(1);
  }

  const gameDirectory = process.argv[2];

  await readPackage(gameDirectory, 'S_Light_Geo.xxx');
};

const readPackage = async (gameDirectory: string, packageFile: string) => {
  // TODO
  // const PACKAGE_SUBDIRECTORY = 'XGame/CookedPCConsole_FR';
  const PACKAGE_SUBDIRECTORY = 'XGame/CookedPCConsole_FR/unpacked';

  const arrayBuffer = (
    await readFile(
      resolve(__dirname, gameDirectory, PACKAGE_SUBDIRECTORY, packageFile)
    )
  ).buffer;

  const reader = new UTReader(arrayBuffer);
  const unrealPackage = reader.readPackage();
  console.log(unrealPackage.version);

  console.log(unrealPackage.getNameTable());
};

main();
