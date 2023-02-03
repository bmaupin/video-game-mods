// Generate an all-black raw DXT1 file for testing

import { writeFile } from 'fs/promises';
import { resolve } from 'path';

const main = async () => {
  const length = 131072;

  const uint8array = new Uint8Array(length);

  for (let byte = 4; byte < length; byte += 8) {
    uint8array.set([0xaa, 0xaa, 0xaa, 0xaa], byte);
  }

  await writeFile(resolve(process.cwd(), 'test-dxt1.bin'), uint8array);
};

main();
