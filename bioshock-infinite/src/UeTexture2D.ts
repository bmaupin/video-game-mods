import UePackageReader from './UePackageReader';

// This was mostly put together by observing an object using UE Explorer; it's probably
// way off 🤷‍♂️
export default class UeTexture2D {
  private reader: UePackageReader;
  // properties: {
  //   [key: string]: string
  // } = {};
  // properties = {}
  format = '';
  sizeX = 0;
  sizeY = 0;
  textureFileCacheName = '';

  constructor(reader: UePackageReader) {
    this.reader = reader;

    this.readProperties();
  }

  private readProperties() {
    const _netIndex = this.reader.getUint32();

    let propertyName = this.reader.getNameIndex();
    while (propertyName !== 'None') {
      const value = this.readProperty(propertyName);

      propertyName = this.reader.getNameIndex();
    }
  }

  private readProperty(propertyName: string) {
    const propertyType = this.reader.getNameIndex();

    if (propertyType === 'ByteProperty') {
      const valueSize = this.reader.getUint32();
      const _unknown = this.reader.getUint32();
      let value;
      if (valueSize === 4) {
        value = this.reader.getUint32();
      }

      if (value && propertyName === 'SizeX') {
        this.sizeX = value;
      }
      if (value && propertyName === 'SizeY') {
        this.sizeY = value;
      }
    }

    if (propertyType === 'IntProperty') {
      const valueSize = this.reader.getUint32();
      const _unknown = this.reader.getUint32();

      let value = '';
      if (valueSize === 8) {
        value = `${this.reader.getNameIndex()}.${this.reader.getNameIndex()}`;
      }

      if (propertyName === 'Format') {
        this.format = value;
      }
    }

    if (propertyType === 'NameProperty') {
      const valueSize = this.reader.getUint32();
      const _unknown = this.reader.getUint32();

      let value = '';
      if (valueSize === 8) {
        value = this.reader.getNameIndex();
      }

      if (propertyName === 'TextureFileCacheName') {
        this.textureFileCacheName = value;
      }
    }
  }
}
