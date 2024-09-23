const fs = require("node:fs/promises");
const { pipeline } = require("node:stream");

// MEMORY Usage: Very high(depending on the file size);
// Execution time: Relatively higher than stream implementation.
// (async () => {
//   console.time("copy");
//   const destFile = await fs.open("text-copy.txt", "w");
//   const result = await fs.readFile("test.txt");

//   await destFile.write(result);
//   console.timeEnd("copy");
// })();

// Our own implementation of stream using buffer.
// (async () => {
//   console.time("copy");

//   const srcFile = await fs.open("text-small.txt", "r");
//   const destFile = await fs.open("text-copy.txt", "w");

//   let bytesRead = -1;
//   while (bytesRead !== 0) {
//     const readResult = await srcFile.read();
//     bytesRead = readResult.bytesRead;

//     // console.log(readResult.bytesRead);

//     if (bytesRead !== 16384) {
//       const indexOfNotFilled = readResult.buffer.indexOf(0);
//       const newBuffer = Buffer.alloc(indexOfNotFilled);
//       readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
//       destFile.write(newBuffer);
//     } else {
//       destFile.write(readResult.buffer);
//     }

//     // TODO: This code below needs to be fixed.
//     // if (readResult.bytesRead < 16384 && readResult.bytesRead !== 0) {
//     //   const slicedBuffer = readResult.buffer.subarray(
//     //     0,
//     //     readResult.buffer.length
//     //   );
//     //   console.log("slicedBuffer", slicedBuffer[14360]);
//     //   await destFile.write(slicedBuffer);
//     // } else if (readResult.bytesRead !== 0) {
//     //   await destFile.write(readResult.buffer);
//     // }
//   }
//   console.log("Hello".red);
//   console.timeEnd("copy");
// })();

(async () => {
  console.time("copy");

  const srcFile = await fs.open("test-big.txt", "r");
  const destFile = await fs.open("text-copy.txt", "w");

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();

  // pipe method is not good for production
  // console.log(readStream.readableFlowing);
  // readStream.pipe(writeStream);
  // console.log(readStream.readableFlowing);
  // readStream.unpipe(writeStream);
  // console.log(readStream.readableFlowing);
  // readStream.on("end", () => {
  //   console.timeEnd("copy");
  // });
  pipeline(readStream, writeStream, (err) => {
    console.log(err);
    console.timeEnd("copy`");
  });
})();
