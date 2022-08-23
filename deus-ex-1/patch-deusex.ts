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
  // 256 x 128
  // const startingByte = 0x004545f7;

  // BumFemaleTex1
  let startingByte = 0x006b5197;
  let maskStartX = 81;
  let maskEndX = 170;
  let maskStartY = 98;

  let xLength = 256;
  let yLength = 128;
  patchMipMap(
    arrayBuffer,
    startingByte,
    xLength,
    yLength,
    maskStartX,
    maskEndX,
    maskStartY
  );

  // 128 x 64
  startingByte = startingByte + 0x8011;
  maskStartX = Math.round(maskStartX / 2);
  maskEndX = Math.round(maskEndX / 2);
  maskStartY = Math.round(maskStartY / 2);
  xLength = Math.round(xLength / 2);
  yLength = Math.round(yLength / 2);
  patchMipMap(
    arrayBuffer,
    startingByte,
    xLength,
    yLength,
    maskStartX,
    maskEndX,
    maskStartY
  );

  // 64 x 32
  startingByte = startingByte + 0x2010;
  maskStartX = Math.round(maskStartX / 2);
  maskEndX = Math.round(maskEndX / 2);
  maskStartY = Math.round(maskStartY / 2);
  xLength = Math.round(xLength / 2);
  yLength = Math.round(yLength / 2);
  patchMipMap(
    arrayBuffer,
    startingByte,
    xLength,
    yLength,
    maskStartX,
    maskEndX,
    maskStartY
  );

  // 32 x 16
  startingByte = startingByte + 0x810;
  maskStartX = Math.round(maskStartX / 2);
  maskEndX = Math.round(maskEndX / 2);
  maskStartY = Math.round(maskStartY / 2);
  xLength = Math.round(xLength / 2);
  yLength = Math.round(yLength / 2);
  patchMipMap(
    arrayBuffer,
    startingByte,
    xLength,
    yLength,
    maskStartX,
    maskEndX,
    maskStartY
  );

  // 16 x 8
  startingByte = startingByte + 0x210;
  maskStartX = Math.round(maskStartX / 2);
  maskEndX = Math.round(maskEndX / 2);
  maskStartY = Math.round(maskStartY / 2);
  xLength = Math.round(xLength / 2);
  yLength = Math.round(yLength / 2);
  patchMipMap(
    arrayBuffer,
    startingByte,
    xLength,
    yLength,
    maskStartX,
    maskEndX,
    maskStartY
  );

  // 8 x 4
  startingByte = startingByte + 0x8f;
  maskStartX = Math.round(maskStartX / 2);
  maskEndX = Math.round(maskEndX / 2);
  maskStartY = Math.round(maskStartY / 2);
  xLength = Math.round(xLength / 2);
  yLength = Math.round(yLength / 2);
  patchMipMap(
    arrayBuffer,
    startingByte,
    xLength,
    yLength,
    maskStartX,
    maskEndX,
    maskStartY
  );

  // 4 x 2
  startingByte = startingByte + 0x2f;
  maskStartX = Math.round(maskStartX / 2);
  maskEndX = Math.round(maskEndX / 2);
  maskStartY = Math.round(maskStartY / 2);
  xLength = Math.round(xLength / 2);
  yLength = Math.round(yLength / 2);
  patchMipMap(
    arrayBuffer,
    startingByte,
    xLength,
    yLength,
    maskStartX,
    maskEndX,
    maskStartY
  );
};

const patchMipMap = (
  arrayBuffer: ArrayBuffer,
  startingByte: number,
  xLength: number,
  yLength: number,
  maskStartX: number,
  maskEndX: number,
  maskStartY: number
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
