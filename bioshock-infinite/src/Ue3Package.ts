import invariant from 'tiny-invariant';

export class Ue3Package {
  private arrayBuffer: ArrayBuffer;
  private nameTable: String[] = [];
  private reader: UePackageReader;

  constructor(arrayBuffer: ArrayBuffer) {
    this.arrayBuffer = arrayBuffer;
    this.reader = new UePackageReader(this.arrayBuffer);

    this.readHeader();
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

    const packageVersion = this.reader.getUint16();
    // I think UE4 package versions are < 0
    invariant(packageVersion > 0, 'Package version should be > 0');

    const _licenseeVersion = this.reader.getUint16();
    if (packageVersion >= 249) {
      const _headerSize = this.reader.getUint32();
    }
    // TODO: add version check for this; it's not documented
    const _unknown = this.reader.getUint32();
    if (packageVersion >= 269) {
      const _folderName = this.reader.getString();
    }
    const _packageFlags = this.reader.getUint32();

    // // Skip ahead to
    // const nameCountStartingByte = 0x10 + folderNameSize + 0x04;
    // const nameTableNumEntries = dataView.getUint32(nameCountStartingByte, true);
    // const nameTableStartingByte = dataView.getUint32(
    //   nameCountStartingByte + 4,
    //   true
    // );

    // this.populateNameTable(nameTableStartingByte, nameTableNumEntries);
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

  // TODO: 0xcfb
  private populateNameTable(
    startingByte: number,
    numEntries: number
  ): String[] {
    for (let i = 0; i <= numEntries; i++) {
      // this.nameTable[i] = getUeString
      // TODO
      // 1. get each name table entry
      //    1. length (4 bytes)
      //    1. string
      //    1. flags (8 bytes)
    }
  }
}

class UePackageReader {
  private arrayBuffer: ArrayBuffer;
  private byteOffset: number = 0;
  private dataView: DataView;

  constructor(arrayBuffer: ArrayBuffer) {
    this.arrayBuffer = arrayBuffer;
    this.dataView = new DataView(this.arrayBuffer);
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

  seekToByte(byteOffset: number): void {
    invariant(
      byteOffset <= this.arrayBuffer.byteLength,
      "(seekToByte) offset isn't beyond the end of the file"
    );
    this.byteOffset = byteOffset;
  }
}
