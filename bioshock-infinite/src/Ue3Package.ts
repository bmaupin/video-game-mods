import invariant from 'tiny-invariant';

// TODO: if we ever want to make this work with UE1/UE2 packages, we'll probably need
//       to update many of the numeric values to be read using the compact index format
//       (https://wiki.beyondunreal.com/Unreal_package#Compact_index_format)
export class Ue3Package {
  private arrayBuffer: ArrayBuffer;
  private nameTable: String[] = [];
  private nameTableCount: number = 0;
  private nameTableOffset: number = 0;
  private reader: UePackageReader;

  private _fileVersion: number = 0;

  constructor(arrayBuffer: ArrayBuffer) {
    this.arrayBuffer = arrayBuffer;
    this.reader = new UePackageReader(this.arrayBuffer);

    this.readHeader();
    this.populateNameTable();
  }

  get fileVersion() {
    return this._fileVersion;
  }

  // http://eliotvu.com/page/unreal-package-file-format
  private readHeader() {
    const fileSignature = this.reader.getUint8Array(4);
    invariant(
      Ue3Package.compareUint8Arrays(
        fileSignature,
        new Uint8Array([0xc1, 0x83, 0x2a, 0x9e])
      ),
      'Validate file signature'
    );

    this._fileVersion = this.reader.getUint16();
    // I think UE4 package versions are < 0
    invariant(this.fileVersion > 0, 'Package version should be > 0');

    const _licenseeVersion = this.reader.getUint16();
    if (this.fileVersion >= 249) {
      const _headerSize = this.reader.getUint32();
    }
    // TODO: add version check for this; it's not documented
    const _unknown = this.reader.getUint32();
    if (this.fileVersion >= 269) {
      const _folderName = this.reader.getString();
    }
    const _packageFlags = this.reader.getUint32();

    this.nameTableCount = this.reader.getUint32();
    this.nameTableOffset = this.reader.getUint32();
  }

  // https://stackoverflow.com/a/19746771/399105
  private static compareUint8Arrays = (
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

  private populateNameTable() {
    const oldByteOffset = this.reader.byteOffset;
    this.reader.byteOffset = this.nameTableOffset;

    for (let i = 0; i <= this.nameTableCount; i++) {
      this.nameTable[i] = this.reader.getString();
      if (this.fileVersion < 141) {
        const _nameFlags = this.reader.getUint8Array(4);
      } else {
        const _nameFlags = this.reader.getUint8Array(8);
      }
    }

    // Put the old byte offset back so that we can run this method whenever we want
    // without breaking any other data serialization
    this.reader.byteOffset = oldByteOffset;
  }
}

class UePackageReader {
  private arrayBuffer: ArrayBuffer;
  private _byteOffset: number = 0;
  private dataView: DataView;

  constructor(arrayBuffer: ArrayBuffer) {
    this.arrayBuffer = arrayBuffer;
    this.dataView = new DataView(this.arrayBuffer);
  }

  get byteOffset() {
    return this._byteOffset;
  }

  set byteOffset(newByteOffset: number) {
    invariant(
      newByteOffset <= this.arrayBuffer.byteLength,
      "New byte offset isn't beyond the end of the file"
    );
    this._byteOffset = newByteOffset;
  }

  getUint8Array(length: number): Uint8Array {
    const uintArray = new Uint8Array(this.arrayBuffer, this.byteOffset, length);
    this.byteOffset += length;

    return uintArray;
  }

  getUint16(): number {
    const uint16 = this.dataView.getUint16(this.byteOffset, true);
    this.byteOffset += 2;
    return uint16;
  }

  getUint32(): number {
    const uint32 = this.dataView.getUint32(this.byteOffset, true);
    this.byteOffset += 4;
    return uint32;
  }

  // Get a string and update the byte offset. The first 4 bytes are the string length.
  getString(): string {
    const stringLength = this.getUint32();
    const uintArray = new Uint8Array(
      this.arrayBuffer,
      this.byteOffset,
      stringLength
    );
    this.byteOffset += stringLength;

    return new TextDecoder('utf8').decode(uintArray).replace(/\0.*$/g, '');
  }
}