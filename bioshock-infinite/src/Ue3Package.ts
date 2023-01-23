import invariant from 'tiny-invariant';

import UePackageReader from './UePackageReader';

// TODO: if we ever want to make this work with UE1/UE2 packages, we'll probably need
//       to update many of the numeric values to be read using the compact index format
//       (https://wiki.beyondunreal.com/Unreal_package#Compact_index_format)
export default class Ue3Package {
  private arrayBuffer: ArrayBuffer;
  private reader: UePackageReader;

  constructor(arrayBuffer: ArrayBuffer) {
    this.arrayBuffer = arrayBuffer;
    this.reader = new UePackageReader(this.arrayBuffer);

    this.reader.readHeader();
    this.reader.populateNameTable();
    this.reader.populateImportTable();
    this.reader.populateExportTable();
    // this.populateExportTable();

    // // console.log('this.nameTable=', this.nameTable);
    // // console.log('this.importTable=', this.importTable);
    // console.log('this.exportTable=', this.reader.exportTable.slice(0, 10));
    // // console.log('this.exportTable=', this.exportTable);

    // console.log(
    //   "getObject('BloodPool_MASK')=",
    //   this.getObject('BloodPool_MASK')
    // );

    this.reader.debug();
  }

  // getObject(name: string) {
  //   return this.exportTable.filter((item) =>
  //     item.name?.toLowerCase().startsWith(name.toLowerCase())
  //   );
  // }
}
