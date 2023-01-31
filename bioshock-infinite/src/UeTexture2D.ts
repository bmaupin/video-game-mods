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

    // TODO: read mip maps
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
        throw new Error('Unhandled ByteProperty value size');
      }
    }

    //
    else if (propertyType === 'IntProperty') {
      if (valueSize === 4) {
        return this.reader.getInt32();
      } else {
        throw new Error('Unhandled IntProperty value size');
      }
    }

    //
    else if (propertyType === 'NameProperty') {
      if (valueSize === 8) {
        return this.reader.getNameIndex();
      } else {
        throw new Error('Unhandled NameProperty value size');
      }
    }
  }
}
