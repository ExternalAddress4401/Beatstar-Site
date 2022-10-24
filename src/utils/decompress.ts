import zlib from "zlib";

export function decompress(data: string) {
  return new Promise(function (resolve, reject) {
    zlib.gunzip(data, (err, buffer) => {
      if (err) {
        reject("Invalid data passed to decompress.");
      }
      resolve(buffer);
    });
  });
}
