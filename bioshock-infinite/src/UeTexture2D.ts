import invariant from 'tiny-invariant';

import UePackageReader from './UePackageReader';

// This was mostly put together by observing an object using UE Explorer; it's probably
// way off 🤷‍♂️
export default class UeTexture2D {
  private reader: UePackageReader;
  properties: {
    [key: string]: number | string | undefined;
  } = {};

  constructor(reader: UePackageReader, byteOffset: number) {
    this.reader = reader;
    this.reader.byteOffset = byteOffset;

    this.readProperties();
  }

  blackOutTexture() {
    if (this.properties.Format !== 'EPixelFormat.PF_DXT1') {
      throw new Error(`Unhandled format: ${this.properties.Format}`);
    }

    const numMipMaps = this.reader.getUint32();

    for (let i = 0; i < numMipMaps; i++) {
      const flags = this.reader.getUint32();
      const isMipMapExternal = flags & 1;
      const uncompressedSize = this.reader.getUint32();
      const compressedSize = this.reader.getUint32();
      const byteOffset = this.reader.getUint32();

      if (isMipMapExternal) {
        // TODO
      }

      //
      else {
        invariant(
          byteOffset === this.reader.byteOffset,
          'Make sure internal mipmap byte offset matches current byte offset'
        );

        // TODO: for now we're only handling mipMaps stored externally
        this.reader.byteOffset += compressedSize;
      }

      const sizeX = this.reader.getUint32();
      const sizeY = this.reader.getUint32();

      if (i === 0) {
        invariant(
          sizeX === this.properties.SizeX,
          'First mipmap should match texture width'
        );
        invariant(
          sizeY === this.properties.SizeY,
          'First mipmap should match texture height'
        );
      }
    }
  }

  private readProperties() {
    const _unknown = this.reader.getUint32();

    let propertyName = this.reader.getNameIndex();
    while (propertyName !== 'None') {
      this.properties[propertyName] = this.readProperty();

      propertyName = this.reader.getNameIndex();
    }
  }

  private readProperty(): number | string | undefined {
    const propertyType = this.reader.getNameIndex();
    const valueSize = this.reader.getInt32();
    const _unknown = this.reader.getUint32();

    if (propertyType === 'ByteProperty') {
      if (valueSize === 8) {
        return `${this.reader.getNameIndex()}.${this.reader.getNameIndex()}`;
      } else {
        throw new Error(`Unhandled ByteProperty value size: ${valueSize}`);
      }
    }

    //
    else if (propertyType === 'IntProperty') {
      if (valueSize === 4) {
        return this.reader.getInt32();
      } else {
        throw new Error(`Unhandled IntProperty value size: ${valueSize}`);
      }
    }

    //
    else if (propertyType === 'NameProperty') {
      if (valueSize === 8) {
        return this.reader.getNameIndex();
      } else {
        throw new Error(`Unhandled NameProperty value size: ${valueSize}`);
      }
    }
  }
}
