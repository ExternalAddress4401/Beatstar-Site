import { execFile } from "child_process";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

export async function extract(input) {
  const job = uuidv4();
  fs.mkdir(`./${job}`);
  fs.writeFile(`./${job}/input.bundle`, input);

  const fileName =
    process.platform === "linux"
      ? "UnityAssetReplacer"
      : "UnityAssetReplacer.exe";

  return new Promise(function (resolve, reject) {
    execFile(
      `tools/replacer/${fileName}`,
      ["-b", `./${job}/input.bundle`, "-d", `./${job}`, "-m", "m_Script"],
      async function (a1, a2, a3) {
        const data = await fs.readFile(
          `./${job}/` +
            (
              await fs.readdir(`./${job}`)
            ).filter((file) => file !== "input.bundle")[0]
        );

        fs.rm(`./${job}`, { recursive: true, force: true });

        resolve(data);
      }
    );
  });
}
