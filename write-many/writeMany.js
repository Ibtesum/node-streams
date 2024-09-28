// create a file , write something 1 million times.
// const fs = require("node:fs/promises");

// Execution time : around 8 seconds
// CPU usage: 100% (one core)
// Memory usage: 18MB
// (async () => {
//   console.time("TotalTime");
//   const fileHandler = await fs.open("test.txt", "w");
//   for (let i = 1; i <= 100000; i++) {
//     await fileHandler.write(` ${i} `);
//   }
//   await fileHandler.close();
//   console.timeEnd("TotalTime");
// })();

// const fs = require("node:fs");

// Execution time : around 1 seconds
// CPU usage: 100% (one core)
// Memory usage: 18MB
// (() => {
//   console.time("writeMany");
//   fs.open("test.txt", "w", (err, fd) => {
//     for (let i = 1; i <= 100000; i++) {
//       const buff = Buffer.from(` ${i} `, "utf-8");
//       fs.writeSync(fd, buff);
//     }
//   });
//   console.timeEnd("writeMany");
// })();

// const fs = require("node:fs/promises");

// DON'T DO THIS!!
// Execution time : 530ms
// CPU usage: 100% (one core)
// Memory usage: 100MB
// (async () => {
//   console.time("TotalTime");
//   const fileHandler = await fs.open("test.txt", "w");
//   const stream = fileHandler.createWriteStream();
//   for (let i = 1; i <= 100000; i++) {
//     const buff = Buffer.from(` ${i} `, "utf-8");
//     stream.write(buff);
//   }
//   await fileHandler.close();
//   console.timeEnd("TotalTime");
// })();

const fs = require("node:fs/promises");

(async () => {
  console.time("TotalTime");
  const fileHandler = await fs.open("test.txt", "w");
  const stream = fileHandler.createWriteStream();

  // const buff = Buffer.alloc(16384, "10");
  // // console.log(stream.write(Buffer.alloc(1, "a")));
  // console.log(stream.write(buff));
  // console.log(stream.writableLength);

  // stream.on("drain", () => {
  //   console.log(stream.write(Buffer.alloc(16384, "a")));
  //   console.log(stream.writableLength);
  //   console.log("we are now safe to write more!");
  // });

  let i = 0;

  const numberOfWrites = 10000000;

  const writeMany = () => {
    while (i < numberOfWrites) {
      const buff = Buffer.from(` ${i} `, "utf-8");
      i++;

      // This is our last write
      if (i === numberOfWrites - 1) return stream.end(buff);

      // if stream.write returns false, stop the loop.
      if (!stream.write(buff)) break;
    }
  };

  writeMany();

  // resumes once our stream's internal buffer is empty
  stream.on("drain", () => {
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("TotalTime");
    fileHandler.close();
  });
})();
