import { readFile, writeFile } from 'fs/promises';
// @ts-ignore
import lzo from 'lzo';
import { resolve } from 'path';
import invariant from 'tiny-invariant';

import { areUint8ArraysEqual } from './utils';

interface ChunkHeader {
  // Length of the entire chunk, including the header and all the blocks
  chunkLength: number;
  // Compressed size of the data
  compressedDataSize: number;
  // Decompressed size of the data
  decompressedDataSize: number;
  // Maximum uncompressed size of a block
  maxBlockSize: number;
  // Number of blocks
  numBlocks: number;
}

interface BlockHeader {
  // Compressed size of a block
  compressedSize: number;
  // Decompressed size of a block
  decompressedSize: number;
}

/* Each "chunk" in the TFC file contains:
 * - A 16-byte header
 * - One or more 8-byte block headers
 * - One or more blocks
 */
export default class UeTextureFileCache {
  static blackOutMipMap = async (
    tfcFilePath: string,
    startingByte: number,
    byteLength: number,
    textureFormat: string
  ) => {
    const arrayBuffer = (await readFile(resolve(__dirname, tfcFilePath)))
      .buffer;

    const chunkHeader = this.readChunkHeader(
      arrayBuffer,
      startingByte,
      byteLength
    );

    UeTextureFileCache.validateBlockData(
      arrayBuffer,
      startingByte + 16,
      chunkHeader
    );

    let newDecompressedBlockData: Uint8Array;
    if (textureFormat === 'EPixelFormat.PF_DXT1') {
      newDecompressedBlockData = UeTextureFileCache.generateBlackDxt1(
        chunkHeader.decompressedDataSize
      );
    } else if (textureFormat === 'EPixelFormat.PF_DXT5') {
      newDecompressedBlockData = UeTextureFileCache.generateBlackDxt5(
        chunkHeader.decompressedDataSize
      );
    } else {
      throw new Error(`Unhandled texture format: ${textureFormat}`);
    }

    const newCompressedBlocks = [] as Buffer[];
    let uncompressedBlockOffset = 0;
    for (let i = 0; i < chunkHeader.numBlocks; i++) {
      const uncompressedBlockData = new Uint8Array(
        newDecompressedBlockData.slice(
          uncompressedBlockOffset,
          uncompressedBlockOffset + chunkHeader.maxBlockSize
        )
      );

      newCompressedBlocks.push(lzo.compress(uncompressedBlockData));

      uncompressedBlockOffset += chunkHeader.maxBlockSize;
    }

    invariant(
      this.getSizeOfBufferArray(newCompressedBlocks) <=
        chunkHeader.compressedDataSize,
      'New compressed blocks should be equal to or smaller than original compressed blocks'
    );

    // TODO: remove this
    await writeFile(
      resolve(process.cwd(), 'compressed-raw-dds.bin'),
      newDecompressedBlockData
    );

    UeTextureFileCache.applyPatch(
      arrayBuffer,
      startingByte,
      newCompressedBlocks
    );

    await writeFile(resolve(__dirname, tfcFilePath), Buffer.from(arrayBuffer));
  };

  private static readChunkHeader = (
    arrayBuffer: ArrayBuffer,
    startingByte: number,
    byteLength: number
  ): ChunkHeader => {
    const dataView = new DataView(arrayBuffer, startingByte, 16);

    const magic = new Uint8Array(arrayBuffer, startingByte, 4);
    invariant(
      areUint8ArraysEqual(magic, new Uint8Array([0xc1, 0x83, 0x2a, 0x9e])),
      'Validate magic number'
    );

    const maxBlockSize = dataView.getUint32(4, true);
    const compressedChunkSize = dataView.getUint32(8, true);
    const decompressedChunkSize = dataView.getUint32(12, true);
    const numBlocks = Math.ceil(decompressedChunkSize / maxBlockSize);

    invariant(
      (byteLength = compressedChunkSize + 16 + numBlocks * 8),
      'Validate length of chunk'
    );

    return {
      chunkLength: byteLength,
      compressedDataSize: compressedChunkSize,
      decompressedDataSize: decompressedChunkSize,
      maxBlockSize,
      numBlocks,
    };
  };

  // Do some basic validation and a test decompression of the block data
  private static validateBlockData = (
    arrayBuffer: ArrayBuffer,
    startingByte: number,
    chunkHeader: ChunkHeader
  ): void => {
    const dataView = new DataView(
      arrayBuffer,
      startingByte,
      chunkHeader.chunkLength
    );

    let byteOffset = 0;
    const blockHeaders = [] as BlockHeader[];
    for (let i = 0; i < chunkHeader.numBlocks; i++) {
      blockHeaders.push({
        compressedSize: dataView.getUint32(byteOffset, true),
        decompressedSize: dataView.getUint32(byteOffset + 4, true),
      });

      byteOffset += 8;
    }

    if (chunkHeader.numBlocks === 1) {
      invariant(
        blockHeaders[0].compressedSize === chunkHeader.compressedDataSize,
        'Compressed chunk block size should be the same as compressed chunk size'
      );
      invariant(
        blockHeaders[0].decompressedSize === chunkHeader.decompressedDataSize,
        'Decompressed chunk block size should be the same as decompressed chunk size'
      );
    }

    // Do a decompression as a sanity check; the data isn't actually used in any way
    for (const blockSize of blockHeaders) {
      const compressedChunkBlock = new Uint8Array(
        arrayBuffer,
        startingByte + byteOffset,
        blockSize.compressedSize
      );
      byteOffset += blockSize.compressedSize;
      const _decompressedChunkBlock: Buffer = lzo.decompress(
        compressedChunkBlock,
        blockSize.decompressedSize
      );
    }
  };

  private static generateBlackDxt1 = (
    decompressedLength: number
  ): Uint8Array => {
    const uint8array = new Uint8Array(decompressedLength);

    for (let byte = 4; byte < decompressedLength; byte += 8) {
      uint8array.set([0xaa, 0xaa, 0xaa, 0xaa], byte);
    }

    return uint8array;
  };

  private static generateBlackDxt5 = (
    decompressedLength: number
  ): Uint8Array => {
    const uint8array = new Uint8Array(decompressedLength);

    for (let byte = 12; byte < decompressedLength; byte += 16) {
      uint8array.set([0xaa, 0xaa, 0xaa, 0xaa], byte);
    }

    return uint8array;
  };

  private static getSizeOfBufferArray = (bufferArray: Buffer[]) => {
    let bufferArraySize = 0;
    for (const buffer of bufferArray) {
      bufferArraySize += buffer.length;
    }
    return bufferArraySize;
  };

  private static applyPatch = (
    arrayBuffer: ArrayBuffer,
    startingByte: number,
    newCompressedBlocks: Buffer[]
  ) => {
    // Create a dataView just for the header
    const dataView = new DataView(
      arrayBuffer,
      startingByte,
      16 + 8 * newCompressedBlocks.length
    );

    // Update compressed chunk size
    dataView.setUint32(8, this.getSizeOfBufferArray(newCompressedBlocks), true);

    let byteOffset = 16;
    // Update block headers
    for (const compressedBlock of newCompressedBlocks) {
      // Update the compressed block size; uncompressed block size will be the same
      dataView.setUint32(byteOffset, compressedBlock.length, true);
      byteOffset += 8;
    }

    for (const compressedBlock of newCompressedBlocks) {
      // Update the compressed block data
      const uint8array = new Uint8Array(
        arrayBuffer,
        // Start after the header
        startingByte + byteOffset,
        compressedBlock.length
      );
      uint8array.set(compressedBlock);
      byteOffset += compressedBlock.length;
    }
  };
}
