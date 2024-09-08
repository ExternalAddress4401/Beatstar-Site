import { execFile } from "child_process";
import { promises as fs } from "fs";

export async function extract(jobId, input) {
  fs.mkdir(`./${jobId}`);
  fs.writeFile(`./${jobId}/input.bundle`, input);

  const fileName =
    process.platform === "linux"
      ? "linux/AssetRipper"
      : "windows/AssetRipper.exe";
  return new Promise<Buffer>(function (resolve, reject) {
    execFile(
      `tools/extractor/${fileName}`,
      [`./${jobId}/input.bundle`, "-o", `./${jobId}/output`, "-q"],
      async function (a1, a2, a3) {
        const folder = await fs.readdir(
          `./${jobId}/output/ExportedProject/Assets/TextAsset`
        );
        const file = await fs.readFile(
          `./${jobId}/output/ExportedProject/Assets/TextAsset/` +
            folder.filter((el) => el.endsWith(".bytes"))[0]
        );
        resolve(file);
      }
    );
  });
}

export async function extractTextures(jobId, input) {
  fs.mkdir(`./${jobId}`);
  fs.writeFile(`./${jobId}/input.bundle`, input);

  const fileName =
    process.platform === "linux"
      ? "linux./UnityAssetReplacer"
      : "UnityAssetReplacer.exe";

  return new Promise(function (resolve, reject) {
    execFile(
      `tools/replacer/${fileName}`,
      ["-b", `./${jobId}/input.bundle`, "-t", "-d", `./${jobId}`],
      async function (a1, a2, a3) {
        const data = await fs.readFile(
          `./${jobId}/` +
            (
              await fs.readdir(`./${jobId}`)
            ).filter((file) => file.endsWith(".png"))[0]
        );

        resolve(data.toString("base64"));
      }
    );
  });
}
