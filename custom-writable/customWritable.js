const { Writable } = require("node:stream");
const fs = require("node:fs");

class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunkSize = 0;
    this.writesCount = 0;
  }

  // This will run after the constructor
  // And it will put off calling all the other methods
  // until we call the callback function
  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        // so if we call the callback with an argument,
        // it means that we have an error
        // and we should not proceed.
        callback(err);
      } else {
        this.fd = fd;
        // no argument means it was successful
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunkSize +=chunk.length;

    if(this.chunkSize > this.writableHighWaterMark ){
      fs.write(this.fd, Buffer.concat(this.chunks), (err)=> {
        if(err) return callback(err);
        this.chunks = [];
        this.chunkSize = 0;
        ++this.writesCount;
        callback();
      })
    } else {
      // when we're done, we should call the callback function.
      callback();

    }
  }

  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err)=> {
      if(err) return callback(err);

      this.chunks = [];
      callback();
    })
  }

  _destroy(error, callback) {
    console.log("Number of writes: ", this.writesCount);
    if(this.fd){
      fs.close(this.fd, (err)=> {
        callback(err || error)
      })
    } else{
      callback(error)
    }
  }
}

const stream = new FileWriteStream({
  highWaterMark: 1800,
  fileName: "text.txt",
});
stream.write(Buffer.from("this is some string."));
stream.end(Buffer.from("Our last write."));
