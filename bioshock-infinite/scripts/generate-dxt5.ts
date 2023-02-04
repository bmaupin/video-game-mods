// Generate an all-black raw DXT5 file for testing

import { writeFile } from 'fs/promises';
import { resolve } from 'path';

const main = async () => {
  const length = 65536;

  const uint8array = new Uint8Array(length);

  for (let byte = 12; byte < length; byte += 16) {
    uint8array.set([0xaa, 0xaa, 0xaa, 0xaa], byte);
  }

  await writeFile(resolve(process.cwd(), 'test-dxt5.bin'), uint8array);
};

main();
