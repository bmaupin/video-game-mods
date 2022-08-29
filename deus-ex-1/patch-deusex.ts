// Requires at least Node 10 for fs/promises
// To run:
// npx -p typescript tsc patch-deusex.ts; node patch-deusex.js ~/.steam/steam/steamapps/common/Deus\ Ex/

import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

interface ExcludeRegion {
  startX: number;
  startY: number;
  endX: number;
  // TODO: add endY for consistency?
}

const main = async () => {
  if (process.argv.length !== 3) {
    console.log(
      'Error: Please provide the path to the Deus Ex installation directory'
    );
    process.exit(1);
  }

  const deusExDirectory = process.argv[2];

  await patchDeusExCharacters(deusExDirectory);
  await patchNewYorkCity(deusExDirectory);
};

const patchDeusExCharacters = async (deusExDirectory: string) => {
  const filePath = 'System/DeusExCharacters.u';
  const arrayBuffer = (
    await readFile(resolve(__dirname, deusExDirectory, filePath))
  ).buffer;

  // BumFemaleTex1
  // The exclude coordinates are for hands and parts of arms. It ends up looking a bit
  // like a dark turtleneck. Classy 😆
  patchMipMaps(arrayBuffer, 0x006b5197, { startX: 83, startY: 81, endX: 166 });

  // Hooker1Tex3
  patchMipMaps(arrayBuffer, 0x003e0dbe, { startX: 83, startY: 81, endX: 166 });

  // Hooker2Tex3
  patchMipMaps(arrayBuffer, 0x004113bc, { startX: 83, startY: 94, endX: 166 });

  // JunkieFemaleTex1
  patchMipMaps(arrayBuffer, 0x004316d0, { startX: 83, startY: 81, endX: 166 });

  // SandraRentonTex1
  patchMipMaps(arrayBuffer, 0x00426b58, { startX: 83, startY: 81, endX: 166 });

  await writeFile(
    resolve(__dirname, deusExDirectory, filePath),
    Buffer.from(arrayBuffer)
  );
};

const patchNewYorkCity = async (deusExDirectory: string) => {
  const filePath = 'Textures/NewYorkCity.utx';
  const arrayBuffer = (
    await readFile(resolve(__dirname, deusExDirectory, filePath))
  ).buffer;

  // JadeDragonBB
  patchMipMaps(arrayBuffer, 0x000fa7c0);

  await writeFile(
    resolve(__dirname, deusExDirectory, filePath),
    Buffer.from(arrayBuffer)
  );
};

const patchMipMaps = (
  arrayBuffer: ArrayBuffer,
  startingByte: number,
  excludeRegion?: ExcludeRegion
) => {
  // Size of the first texture mipmap
  let xLength = 256;
  let yLength = 128;
  // Patch each mipmap in the texture all the way up to and including 4 x 2
  while (yLength > 1) {
    patchMipMap(arrayBuffer, startingByte, xLength, yLength, excludeRegion);

    startingByte =
      startingByte +
      xLength * yLength +
      14 +
      getCompactIndexSize(Math.round(xLength / 2) * Math.round(yLength / 2));

    if (excludeRegion) {
      excludeRegion.startX = Math.round(excludeRegion.startX / 2);
      excludeRegion.startY = Math.round(excludeRegion.startY / 2);
      excludeRegion.endX = Math.round(excludeRegion.endX / 2);
    }
    xLength = Math.round(xLength / 2);
    yLength = Math.round(yLength / 2);
  }
};

// Get the size of the compact index value (in bytes) required to store a particular number value
// The first byte holds up to 2^6 values, each byte after that an additional 2^7 values
// https://bunnytrack.net/ut-package-format/#compact-index-format
const getCompactIndexSize = (value: number) => {
  return Math.floor(Math.log(value / 64) / Math.log(128)) + 2;
};

// Replaces bytes in a mipmap with a darker colour. I first tried changing the texture for
// a different one but the mesh itself needed to be changed, which is impractical since
// changing animations for vertex meshes is very time-consuming (each frame needs to be
// changed), and I don't think the package files can be modified in a way that changes
// their size because it would break all references. The package files can be modified
// by recompiling them, but according to the SDK documentation, some packages (such as
// DeusExCharacters.u) can't be modified because the source files aren't included in the
// SDK
const patchMipMap = (
  arrayBuffer: ArrayBuffer,
  startingByte: number,
  xLength: number,
  yLength: number,
  excludeRegion?: ExcludeRegion
) => {
  for (let currentRow = 0; currentRow < yLength; currentRow++) {
    for (let currentColumn = 0; currentColumn < xLength; currentColumn++) {
      const currentByte = startingByte + currentRow * xLength + currentColumn;

      if (
        !excludeRegion ||
        currentRow < excludeRegion.startY ||
        !excludeRegion ||
        currentColumn < excludeRegion.startX ||
        !excludeRegion ||
        currentColumn > excludeRegion.endX
      ) {
        // Swap the colour for a darker one in the colour palette
        // Colours start at 0x01; for most textures 0x01 is black and they get gradually lighter/more colourful
        writeByte(arrayBuffer, currentByte, [0x02]);
      }
    }
  }
};

const writeByte = (
  arrayBuffer: ArrayBuffer,
  startingByte: number,
  bytesToWrite: ArrayLike<number>
) => {
  const uint8array = new Uint8Array(
    arrayBuffer,
    startingByte,
    bytesToWrite.length
  );
  uint8array.set(bytesToWrite);
};

main();
