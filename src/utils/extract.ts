import { execFile } from "child_process";
import { promises as fs } from "fs";

export async function extract(jobId, input) {
  fs.mkdir(`./${jobId}`);
  fs.writeFile(`./${jobId}/input.bundle`, input);

  const fileName =
    process.platform === "linux"
      ? "UnityAssetReplacer"
      : "UnityAssetReplacer.exe";

  return new Promise(function (resolve, reject) {
    execFile(
      `tools/replacer/${fileName}`,
      ["-b", `./${jobId}/input.bundle`, "-d", `./${jobId}`, "-m", "m_Script"],
      async function (a1, a2, a3) {
        console.log(a1, a2, a3);
        const data = await fs.readFile(
          `./${jobId}/` +
            (
              await fs.readdir(`./${jobId}`)
            ).filter((file) => file !== "input.bundle")[0]
        );

        resolve(data);
      }
    );
  });
}

export async function extractTextures(jobId, input) {
  fs.mkdir(`./${jobId}`);
  fs.writeFile(`./${jobId}/input.bundle`, input);

  const fileName =
    process.platform === "linux"
      ? "UnityAssetReplacer"
      : "UnityAssetReplacer.exe";

  return new Promise(function (resolve, reject) {
    execFile(
      `tools/replacer/${fileName}`,
      ["-b", `./${jobId}/input.bundle`, "-t", "-d", `./${jobId}`],
      async function (a1, a2, a3) {
        console.log(a1, a2, a3);
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
