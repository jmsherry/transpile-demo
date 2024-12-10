import fs from "node:fs";
import { Transform } from "node:stream";

const inputDir = "src";
const outputDir = "dist";

// Create a converter
// const upperCaseTransformer = new Transform({
//   transform(chunk, encoding, callback) {
//     this.push(chunk.toString("utf8").toUpperCase());
//     callback();
//   },
// });

// const readStream = fs.createReadStream('src/initial.txt', { encoding: "utf8" });

// // Create a writable stream
// const writeStream = fs.createWriteStream('dist/initial.txt', { emitClose: true });

// readStream.pipe(upperCaseTransformer).pipe(writeStream);

const transpile = (infile, outfile) => {
  // Create a converter
  const transformer = new Transform({
    transform(chunk, encoding, callback) {
      this.push(chunk.toString("utf8").toUpperCase());
      callback();
    },
  });
  // Create a readable stream
  const readStream = fs.createReadStream(infile, { encoding: "utf8" });

  // Create a writable stream
  const writeStream = fs.createWriteStream(outfile, { emitClose: true });

  // Error handling
  // readStream.on("error", (err) => console.error("Read error:", err));
  // writeStream.on("error", (err) => console.error("Write error:", err));

  // Pipe the read and write operations
  // read input.txt and write data to output.txt
  readStream.pipe(transformer).pipe(writeStream);
};

fs.watch(inputDir, (eventType, fileName) => {
  // Make dist directory if necessary
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const infile = `${inputDir}/${fileName}`;
  const outfile = `${outputDir}/${fileName}`;

  //
  if (eventType === "rename") {
    console.log(`${fileName} was added/deleted`);
    if (!fs.existsSync(infile) && fs.existsSync(outfile)) {
      // remove from output dir
      fs.unlink(fileName, (err) => {
        if (err) {
          console.error(`Error removing file: ${err}`);
          return;
        }

        console.log(`File ${filePath} has been successfully removed.`);
      });
    } else if (fs.existsSync(infile) && !fs.existsSync(outfile)) {
      // transpile(infile, outfile);
      // created
    }
  } else {
    console.log(`${fileName} was updated`);
    transpile(infile, outfile);
  }
});

// What is a buffer
// import {Buffer} from 'node:buffer'

// const str = 'hello';
// const buff = Buffer.from(str, 'utf8');
// console.log('buff', buff);
// const newStr = buff.toString();
// console.log(newStr);
