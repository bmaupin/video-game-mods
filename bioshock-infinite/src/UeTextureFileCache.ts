import { readFile, writeFile } from 'fs/promises';
// @ts-ignore
import lzo from 'lzo';
import { resolve } from 'path';
import invariant from 'tiny-invariant';

import { areUint8ArraysEqual } from './utils';

export default class UeTextureFileCache {
  static blackOutMipMap = async (
    tfcFilePath: string,
    startingByte: number,
    byteLength: number
  ) => {
    const arrayBuffer = (await readFile(resolve(__dirname, tfcFilePath)))
      .buffer;

    const [decompressedChunkBlockSize, oldCompressedChunkBlockSize] =
      await UeTextureFileCache.validateChunkBlockData(
        arrayBuffer,
        startingByte,
        byteLength
      );

    const newCompressedChunkBlock = UeTextureFileCache.generateBlackDxt1(
      decompressedChunkBlockSize
    );
    invariant(
      newCompressedChunkBlock.length <= oldCompressedChunkBlockSize,
      'New compressed chunk block should be equal to or smaller than original compressed chunk block'
    );

    await writeFile(
      resolve(process.cwd(), 'compressed-raw-dds.bin'),
      newCompressedChunkBlock
    );

    UeTextureFileCache.applyPatch(
      arrayBuffer,
      startingByte,
      newCompressedChunkBlock
    );

    await writeFile(resolve(__dirname, tfcFilePath), Buffer.from(arrayBuffer));
  };

  // Do some basic validation and a test decompression of the existing data as a sanity check
  private static validateChunkBlockData = async (
    arrayBuffer: ArrayBuffer,
    startingByte: number,
    byteLength: number
  ) => {
    const dataView = new DataView(arrayBuffer, startingByte, byteLength);

    const magic = new Uint8Array(arrayBuffer, startingByte, 4);
    invariant(
      areUint8ArraysEqual(magic, new Uint8Array([0xc1, 0x83, 0x2a, 0x9e])),
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

    // Do a decompression as a sanity check to make sure we're at the correct spot in the
    // file; the data isn't actually used in any way
    const compressedChunkBlock = new Uint8Array(
      arrayBuffer,
      startingByte + 24,
      compressedChunkBlockSize
    );
    const _decompressedChunkBlock: Buffer = lzo.decompress(
      compressedChunkBlock,
      decompressedChunkBlockSize
    );

    return [decompressedChunkBlockSize, compressedChunkBlockSize];
  };

  private static generateBlackDxt1 = (decompressedLength: number) => {
    const uint8array = new Uint8Array(decompressedLength);

    for (let byte = 4; byte < decompressedLength; byte += 8) {
      uint8array.set([0xaa, 0xaa, 0xaa, 0xaa], byte);
    }

    return lzo.compress(uint8array);
  };

  private static applyPatch = (
    arrayBuffer: ArrayBuffer,
    startingByte: number,
    patchData: ArrayLike<number>
  ) => {
    // Create a dataView just for the header (24 bytes)
    const dataView = new DataView(arrayBuffer, startingByte, 24);

    // Update compressed chunk size
    dataView.setUint32(8, patchData.length, true);
    // Update compressed chunk block size
    dataView.setUint32(16, patchData.length, true);

    // Update the compressed chunk block data
    const uint8array = new Uint8Array(
      arrayBuffer,
      // Start after the header
      startingByte + 24,
      patchData.length
    );
    uint8array.set(patchData);
  };
}
