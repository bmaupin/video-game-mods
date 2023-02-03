import { readFile } from 'fs/promises';

import UePackageReader from './UePackageReader';
import UeTexture2D from './UeTexture2D';

// TODO: if we ever want to make this work with UE1/UE2 packages, we'll probably need
//       to update many of the numeric values to be read using the compact index format
//       (https://wiki.beyondunreal.com/Unreal_package#Compact_index_format)
export default class Ue3Package {
  private arrayBuffer: ArrayBuffer;
  private reader: UePackageReader;

  constructor(arrayBuffer: ArrayBuffer, filePath: string) {
    this.arrayBuffer = arrayBuffer;
    this.reader = new UePackageReader(this.arrayBuffer, filePath);

    this.reader.readHeader();
    this.reader.populateNameTable();
    this.reader.populateImportTable();
    this.reader.populateExportTable();
  }

  static async fromFile(filePath: string): Promise<Ue3Package> {
    const arrayBuffer = (await readFile(filePath)).buffer;
    return new Ue3Package(arrayBuffer, filePath);
  }

  getTexture2D(textureName: string): UeTexture2D {
    const textureExportEntry = this.reader.getExportTableEntry(textureName);

    if (textureExportEntry?.className !== 'Texture2D') {
      console.debug('textureExportEntry=', textureExportEntry);
      throw new Error(
        `Object class for ${textureName} is ${textureExportEntry?.className}; expected Texture2D`
      );
    }

    return new UeTexture2D(this.reader, textureExportEntry?.serialOffset);
  }
}
