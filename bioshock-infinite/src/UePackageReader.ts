import { it } from 'node:test';
import invariant from 'tiny-invariant';

export default class UePackageReader {
  private arrayBuffer: ArrayBuffer;
  private dataView: DataView;
  private exportTable: {
    className: string;
    name: string;
    serialOffset: number;
    serialSize: number;
  }[] = [];
  private exportTableCount: number = 0;
  private exportTableOffset: number = 0;
  private importTable: string[] = [];
  private importTableCount: number = 0;
  private importTableOffset: number = 0;
  private nameTable: string[] = [];
  private nameTableCount: number = 0;
  private nameTableOffset: number = 0;

  private _byteOffset: number = 0;
  private _fileVersion: number = 0;

  constructor(arrayBuffer: ArrayBuffer) {
    this.arrayBuffer = arrayBuffer;
    this.dataView = new DataView(this.arrayBuffer);
  }

  debug() {
    console.log(
      "getObject('BloodPool_MASK')=",
      this.exportTable.filter((item) => item.name === 'BloodPool_MASK')
    );

    console.log('this.nameTable[2046]=', this.nameTable[2046]);
    console.log('this.nameTable[1507]=', this.nameTable[1507]);
    console.log('this.nameTable[1007]=', this.nameTable[1007]);
    console.log('this.nameTable[2237]=', this.nameTable[2237]);
    console.log('this.nameTable[3175]=', this.nameTable[3175]);
  }

  private get fileVersion() {
    return this._fileVersion;
  }

  // http://eliotvu.com/page/unreal-package-file-format
  readHeader() {
    const fileSignature = this.getUint8Array(4);
    invariant(
      UePackageReader.compareUint8Arrays(
        fileSignature,
        new Uint8Array([0xc1, 0x83, 0x2a, 0x9e])
      ),
      'Validate file signature'
    );

    this._fileVersion = this.getUint16();
    // I think UE4 package versions are < 0
    invariant(this.fileVersion > 0, 'Package version should be > 0');

    const _licenseeVersion = this.getUint16();
    if (this.fileVersion >= 249) {
      const _headerSize = this.getUint32();
    }
    // TODO: add version check for this; it's not documented
    const _unknown = this.getUint32();
    if (this.fileVersion >= 269) {
      const _folderName = this.getString();
    }
    const _packageFlags = this.getUint32();

    this.nameTableCount = this.getUint32();
    this.nameTableOffset = this.getUint32();

    this.exportTableCount = this.getUint32();
    this.exportTableOffset = this.getUint32();

    this.importTableCount = this.getUint32();
    this.importTableOffset = this.getUint32();
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

  populateNameTable() {
    const oldByteOffset = this.byteOffset;
    this.byteOffset = this.nameTableOffset;

    for (let i = 0; i <= this.nameTableCount; i++) {
      this.nameTable[i] = this.getString();
      if (this.fileVersion < 141) {
        const _nameFlags = this.getUint8Array(4);
      } else {
        const _nameFlags = this.getUint8Array(8);
      }
    }

    // Put the old byte offset back so that we can run this method whenever we want
    // without breaking any other data serialization
    this.byteOffset = oldByteOffset;
  }

  // TODO: 0x1942b
  populateImportTable() {
    const oldByteOffset = this.byteOffset;
    this.byteOffset = this.importTableOffset;

    for (let i = 0; i <= this.importTableCount; i++) {
      const _packageName = this.getNameIndex();
      const _className = this.getNameIndex();
      const _outerIndex = this.getUint32();

      const name = this.getNameIndex();
      this.importTable[i] = name;
    }

    // Put the old byte offset back so that we can run this method whenever we want
    // without breaking any other data serialization
    this.byteOffset = oldByteOffset;
  }

  // TODO: 0x1c173
  populateExportTable() {
    const oldByteOffset = this.byteOffset;
    this.byteOffset = this.exportTableOffset;

    for (let i = 0; i <= this.exportTableCount; i++) {
      const className = this.getObjectIndex();
      const _superIndex = this.getInt32();
      const _outerIndex = this.getInt32();
      const name = this.getNameIndex();

      if (this.fileVersion >= 220) {
        const _archeTypeIndex = this.getInt32();
      }
      if (this.fileVersion < 195) {
        const _objectFlags = this.getUint8Array(4);
      } else {
        const _objectFlags = this.getUint8Array(8);
      }

      const serialSize = this.getUint32();
      let serialOffset = 0;
      if (serialSize > 0 || this.fileVersion > 249) {
        serialOffset = this.getUint32();
      }

      // TODO
      const _unknown1 = this.getUint32();
      const _unknown2 = this.getUint32();

      this.exportTable[i] = {
        className,
        name,
        serialOffset,
        serialSize,
      };
    }

    // Put the old byte offset back so that we can run this method whenever we want
    // without breaking any other data serialization
    this.byteOffset = oldByteOffset;
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
    const value = this.dataView.getUint16(this.byteOffset, true);
    this.byteOffset += 2;
    return value;
  }

  getInt32(): number {
    const value = this.dataView.getInt32(this.byteOffset, true);
    this.byteOffset += 4;
    return value;
  }

  getUint32(): number {
    const value = this.dataView.getUint32(this.byteOffset, true);
    this.byteOffset += 4;
    return value;
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

  getNameIndex(): string {
    const nameIndex = this.getUint32();
    let name = this.nameTable[nameIndex];

    if (this.fileVersion >= 343) {
      const nameNumber = this.getUint32() - 1;
      if (nameNumber > -1) {
        name += `_${nameNumber}`;
      }
    }

    return name;
  }

  getObjectIndex(): string {
    const classIndex = this.getInt32();
    let objectName = '';
    if (classIndex < 0) {
      objectName = this.importTable[Math.abs(classIndex) - 1];
    } else if (classIndex > 0) {
      objectName = this.exportTable[classIndex]?.name;
    }

    return objectName;
  }
}
