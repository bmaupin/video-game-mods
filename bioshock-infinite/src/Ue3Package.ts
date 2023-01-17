import invariant from 'tiny-invariant';

export class Ue3Package {
  private arrayBuffer: ArrayBuffer;
  private nameTable: String[] = [];

  constructor(arrayBuffer: ArrayBuffer) {
    this.arrayBuffer = arrayBuffer;

    this.readHeader();
  }

  private readHeader() {
    const fileSignature = new Uint8Array(this.arrayBuffer, 0, 4);
    invariant(
      Ue3Package.compareUint8Arrays(
        fileSignature,
        new Uint8Array([0xc1, 0x83, 0x2a, 0x9e])
      ),
      'Validate file signature'
    );

    const dataView = new DataView(this.arrayBuffer);
    const folderNameSize = dataView.getUint32(0x10, true);

    // Skip ahead to
    const nameCountStartingByte = 0x10 + folderNameSize + 0x04;
    const nameTableNumEntries = dataView.getUint32(nameCountStartingByte, true);
    const nameTableStartingByte = dataView.getUint32(
      nameCountStartingByte + 4,
      true
    );

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

  private getUeString = (startingByte: number) => {
    const dataView = new DataView(this.arrayBuffer);
    const stringLength = dataView.getUint32(startingByte, true);
    const uintArray = new Uint8Array(
      this.arrayBuffer,
      startingByte + 4,
      stringLength
    );

    return new TextDecoder('utf8').decode(uintArray).replace(/\0.*$/g, '');
  };
}
