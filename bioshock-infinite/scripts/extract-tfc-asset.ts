// Extract raw assets from TFC file
//
// The assets are decompressed as-is; no additional manipulation is done. Many assets
// (e.g. DDS textures) need a header before they could be manipulated by other programs.
//
// Requires at least Node 10 for fs/promises
//
// To run:
// npx ts-node src/extract-tfc-asset.ts ~/.steam/steam/steamapps/common/BioShock\ Infinite/XGame/CookedPCConsole_FR/WorldTextures2.tfc 267881188 18733

import { readFile, writeFile } from 'fs/promises';
// @ts-ignore
import lzo from 'lzo';
import { resolve } from 'path';
import invariant from 'tiny-invariant';

const main = async () => {
  if (process.argv.length !== 5) {
    console.log('Error: Missing required arguments');
    console.log(
      `Usage: ${process.argv[0]} ${process.argv[1]} /path/to/file.tfc BEGINNING_OFFSET LENGTH`
    );
    process.exit(1);
  }

  const tfcFilePath = process.argv[2];
  const beginningOffset = process.argv[3];
  const byteLength = process.argv[4];

  await extractAsset(tfcFilePath, Number(beginningOffset), Number(byteLength));
};

const extractAsset = async (
  tfcFilePath: string,
  beginningOffset: number,
  byteLength: number
) => {
  const arrayBuffer = (await readFile(resolve(__dirname, tfcFilePath))).buffer;
  const dataView = new DataView(arrayBuffer, beginningOffset, byteLength);

  const magic = new Uint8Array(arrayBuffer, beginningOffset, 4);
  invariant(
    compareUint8Arrays(magic, new Uint8Array([0xc1, 0x83, 0x2a, 0x9e])),
    'Validate magic number'
  );

  const _maxBlockSize = dataView.getUint32(4, true);

  const compressedChunkSize = dataView.getUint32(8, true);
  const decompressedChunkSize = dataView.getUint32(12, true);

  const compressedChunkBlockSize = dataView.getUint32(16, true);
  invariant(
    compressedChunkBlockSize === compressedChunkSize,
    'Compressed chunk block size should be the same as compressed chunk size'
  );

  const decompressedChunkBlockSize = dataView.getUint32(20, true);
  invariant(
    decompressedChunkBlockSize === decompressedChunkSize,
    'Decompressed chunk block size should be the same as decompressed chunk size'
  );

  const compressedChunkBlock = new Uint8Array(
    arrayBuffer,
    beginningOffset + 24,
    compressedChunkBlockSize
  );

  const decompressedChunkBlock: Buffer = lzo.decompress(
    compressedChunkBlock,
    decompressedChunkBlockSize
  );

  await writeFile(resolve(process.cwd(), 'output.bin'), decompressedChunkBlock);
};

// https://stackoverflow.com/a/19746771/399105
const compareUint8Arrays = (
  array1: Uint8Array,
  array2: Uint8Array
): boolean => {
  return (
    array1.length === array2.length &&
    array1.every(function (value, index: number) {
      return value === array2[index];
    })
  );
};

main();
