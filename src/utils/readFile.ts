export const readFile = async (file: File, as: "text" | "arraybuffer") => {
  return new Promise<string | ArrayBuffer>(function (resolve, reject) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(reader.result);
    });
    switch (as) {
      case "text":
        reader.readAsText(file);
        break;
      case "arraybuffer":
        reader.readAsArrayBuffer(file);
        break;
    }
  });
};
