import { it } from 'node:test';
import invariant from 'tiny-invariant';
import UeTexture2D from './UeTexture2D';
import { areUint8ArraysEqual } from './utils';

export default class UePackageReader {
  private arrayBuffer: ArrayBuffer;
  private dataView: DataView;
  filePath: string;

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

  constructor(arrayBuffer: ArrayBuffer, filePath: string) {
    this.arrayBuffer = arrayBuffer;
    this.dataView = new DataView(this.arrayBuffer);
    this.filePath = filePath;
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

    const bloodPoolMaskExport = this.exportTable.find(
      (item) => item.name === 'BloodPool_MASK'
    );

    invariant(bloodPoolMaskExport?.className === 'Texture2D');

    const bloodPoolMask = new UeTexture2D(
      this,
      bloodPoolMaskExport?.serialOffset
    );
    bloodPoolMask.blackOutTexture();

    console.log();
    console.log('bloodPoolMask.properties=', bloodPoolMask.properties);
  }

  private get fileVersion() {
    return this._fileVersion;
  }

  // http://eliotvu.com/page/unreal-package-file-format
  readHeader() {
    const fileSignature = this.getUint8Array(4);
    invariant(
      areUint8ArraysEqual(
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

  populateNameTable() {
    const oldByteOffset = this.byteOffset;
    this.byteOffset = this.nameTableOffset;

    for (let i = 0; i < this.nameTableCount; i++) {
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

    for (let i = 0; i < this.importTableCount; i++) {
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
  // https://github.com/gildor2/UEViewer/blob/eaba2837228f9fe39134616d7bff734acd314ffb/Unreal/UnrealPackage/UnPackage.h

  // References:
  // - UEViewer
  //   - UnPackage.cpp LoadExportTable uses << operator overloading
  //   - Overload is in UnPackage.cpp which points to FObjectExport::Serialize3 in UnPackage3.cpp
  //     https://github.com/gildor2/UEViewer/blob/master/Unreal/UnrealPackage/UnPackage3.cpp#L312
  //   - Types are defined here: https://github.com/gildor2/UEViewer/blob/eaba2837228f9fe39134616d7bff734acd314ffb/Unreal/UnrealPackage/UnPackage.h#L176
  populateExportTable() {
    const oldByteOffset = this.byteOffset;
    this.byteOffset = this.exportTableOffset;

    for (let i = 0; i < this.exportTableCount; i++) {
      const byteOffset = this.byteOffset;

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
      if (serialSize > 0 || this.fileVersion >= 249) {
        serialOffset = this.getUint32();

        invariant(serialOffset > 0, 'Serial offset is greater than 0');
      }

      if (this.fileVersion >= 220) {
        const _exportFlags = this.getUint32();
      }

      // TODO: This seems to be specific to BioShock Infinite
      const _flag = this.getUint32();
      if (Boolean(_flag)) {
        if (this.fileVersion >= 322) {
          const _netObjectCount = this.getUint32();
          // Net object count is an array
          this.byteOffset += _netObjectCount * 4;
          const _guid = this.getUint8Array(16);
        }
        if (this.fileVersion >= 475) {
          const _unknown = this.getUint32();
        }
      }

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

  getBoolean(): boolean {
    const value = this.dataView.getUint8(this.byteOffset);
    this.byteOffset += 1;
    return Boolean(value);
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
