const fs = require("node:fs/promises");

(async () => {
  console.time("ReadWriteTime");
  const fileHandleRead = await fs.open("src.txt", "r");
  const fileHandleWrite = await fs.open("dest.txt", "w");

  const streamRead = fileHandleRead.createReadStream({
    highWaterMark: 64 * 1024,
  });
  const streamWrite = fileHandleWrite.createWriteStream();

  let split = "";

  streamRead.on("data", (chunk) => {
    // TODO: Selectively writing our data from the readable stream

    const numbers = chunk.toString("utf-8").split("  ");

    if (Number(numbers[0]) !== Number(numbers[1]) - 1) {
      if (split) numbers[0] = split.trim() + numbers[0].trim();
    }

    if (
      Number(numbers[numbers.length - 2]) + 1 !==
      Number(numbers[numbers.length - 1])
    ) {
      split = numbers.pop();
    }

    numbers.forEach((number) => {
      let n = Number(number);
      if (n % 2 === 0) {
        if (!streamWrite.write(" " + n + " ")) {
          // MUST DO: IF you dont want to crash your system
          streamRead.pause();
        }
      }
    });
  });

  // MUST DO: IF you dont want to crash your system
  streamWrite.on("drain", () => {
    streamRead.resume();
  });

  streamRead.on("end", () => {
    console.log("Done Reading");
    console.timeEnd("ReadWriteTime");
  });
})();
