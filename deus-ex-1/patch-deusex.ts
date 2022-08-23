// Requires at least Node 10 for fs/promises
// To run:
// npx -p typescript tsc patch-deusex.ts; node patch-deusex.js ~/.steam/steam/steamapps/common/Deus\ Ex/System/DeusExCharacters.u

import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

const main = async () => {
  if (process.argv.length !== 3) {
    console.log('Error: Please provide the path to DeusExCharacters.u');
    process.exit(1);
  }

  const filePath = process.argv[2];
  const arrayBuffer = (await readFile(resolve(__dirname, filePath))).buffer;

  patchDeusExCharacters(arrayBuffer);

  await writeFile(resolve(__dirname, filePath), Buffer.from(arrayBuffer));
};

const patchDeusExCharacters = (arrayBuffer: ArrayBuffer) => {
  // BumFemaleTex1
  patchMipMaps(arrayBuffer, 0x006b5197, 83, 81, 166);

  // Hooker1Tex3
  patchMipMaps(arrayBuffer, 0x003e0dbe, 83, 81, 166);

  // Hooker2Tex3
  patchMipMaps(arrayBuffer, 0x004113bc, 83, 94, 166);

  // JunkieFemaleTex1
  patchMipMaps(arrayBuffer, 0x004316d0, 83, 81, 166);

  // SandraRentonTex1
  patchMipMaps(arrayBuffer, 0x00426b58, 83, 81, 166);
};

const patchMipMaps = (
  arrayBuffer: ArrayBuffer,
  startingByte: number,
  maskStartX: number,
  maskStartY: number,
  maskEndX: number
) => {
  // Size of the first texture mipmap
  let xLength = 256;
  let yLength = 128;

  // Patch each mipmap in the texture all the way up to and including 4 x 2
  while (yLength > 1) {
    patchMipMap(
      arrayBuffer,
      startingByte,
      xLength,
      yLength,
      maskStartX,
      maskStartY,
      maskEndX
    );

    startingByte =
      startingByte +
      xLength * yLength +
      14 +
      getCompactIndexSize(Math.round(xLength / 2) * Math.round(yLength / 2));

    maskStartX = Math.round(maskStartX / 2);
    maskEndX = Math.round(maskEndX / 2);
    maskStartY = Math.round(maskStartY / 2);
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

const patchMipMap = (
  arrayBuffer: ArrayBuffer,
  startingByte: number,
  xLength: number,
  yLength: number,
  maskStartX: number,
  maskStartY: number,
  maskEndX: number
) => {
  for (let currentRow = 0; currentRow < yLength; currentRow++) {
    for (let currentColumn = 0; currentColumn < xLength; currentColumn++) {
      let currentByte = startingByte + currentRow * xLength + currentColumn;

      if (
        currentRow < maskStartY ||
        currentColumn < maskStartX ||
        currentColumn > maskEndX
      ) {
        writeByte(arrayBuffer, currentByte, [0x01]);
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
