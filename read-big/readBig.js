const fs = require("node:fs/promises");

(async () => {
  const fileHandleRead = await fs.open("src.txt", "r");
  const fileHandleWrite = await fs.open("dest.txt", "w");

  const streamRead = fileHandleRead.createReadStream({
    highWaterMark: 64 * 1024,
  });
  const streamWrite = fileHandleWrite.createWriteStream();

  streamRead.on("data", (chunk) => {
    // MUST DO: IF you dont want to crash your system
    if (!streamWrite.write(chunk)) {
      streamRead.pause();
    }
  });

  // MUST DO: IF you dont want to crash your system
  streamWrite.on("drain", () => {
    streamRead.resume();
  });
})();
