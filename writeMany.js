// create a file , write something 1 million times.
const fs = require("node:fs/promises");

// Execution time : around 8 seconds
// CPU usage: 100% (one core)
// Memory usage: 18MB
(async () => {
  console.time("TotalTime");
  const fileHandler = await fs.open("test.txt", "w");
  for (let i = 1; i <= 100000; i++) {
    await fileHandler.write(` ${i} `);
  }
  await fileHandler.close();
  console.timeEnd("TotalTime");
})();
