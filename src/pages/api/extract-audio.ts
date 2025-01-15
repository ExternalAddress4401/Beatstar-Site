import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { promises as fs } from "fs";
import { execFile } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { createReadStream } from "fs";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "8mb",
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = formidable();

  const { files, fields } = await parseForm(form, req);

  if (Object.keys(files).length !== 1) {
    throw new Error("Not enough files uploaded.");
  }

  const audio = files.audio;
  const uuid = uuidv4();

  await fs.mkdir(`./${uuid}`);
  await fs.mkdir(`./${uuid}/input`);
  await fs.mkdir(`./${uuid}/output`);
  await fs.rename(audio.filepath, `./${uuid}/input/audio.bundle`);

  await extractAudio(uuid);
  await extractWem(uuid);
  await convertAudio(uuid);

  createReadStream(`${uuid}/1.ogg`)
    .pipe(res)
    .on("finish", function () {
      fs.rm(`./${uuid}`, { recursive: true, force: true });
      res.status(200);
      res.end();
    });
}

function parseForm(
  form: any,
  req: NextApiRequest
): Promise<{ files: any; fields: any }> {
  return new Promise(function (resolve, reject) {
    form.parse(req, (err, fields, files) => {
      if (err) {
        throw err;
      }
      resolve({
        files,
        fields,
      });
    });
  });
}

async function extractAudio(uuid: string) {
  const fileName =
    process.platform === "linux"
      ? "linux/AssetRipper"
      : "windows/AssetRipper.exe";
  return new Promise<void>(function (resolve, reject) {
    execFile(
      `tools/extractor/${fileName}`,
      [`./${uuid}/input/audio.bundle`, "-o", `./${uuid}/output`, "-q"],
      async function (a1, a2, a3) {
        if (a1 || a2 || a3) {
          console.log(a1);
          console.log(a2);
          console.log(a3);
        }
        const file = (
          await fs.readdir(`./${uuid}/output/ExportedProject/Assets/TextAsset/`)
        ).filter((file) => file.endsWith(".bytes"))[0];
        await fs.rename(
          `./${uuid}/output/ExportedProject/Assets/TextAsset/${file}`,
          `./${uuid}/${file}.bnk`
        );
        resolve();
      }
    );
  });
}
async function extractWem(uuid: string) {
  const fileName = process.platform === "linux" ? "wwiseutil" : "wwiseutil.exe";
  const file = (await fs.readdir(`./${uuid}`)).filter((file) =>
    file.endsWith(".bnk")
  )[0];
  return new Promise<void>(function (resolve, reject) {
    execFile(
      `tools/bnk/${fileName}`,
      ["-u", "-f", `./${uuid}/${file}`, "-o", `./${uuid}`],
      async function (a1, a2, a3) {
        if (a1 || a2 || a3) {
          console.log(a1);
          console.log(a2);
          console.log(a3);
        }
        resolve();
      }
    );
  });
}

async function convertAudio(uuid: string) {
  const fileName = process.platform === "linux" ? "ww2ogg" : "ww2ogg.exe";
  return new Promise<void>(function (resolve, reject) {
    execFile(
      `tools/ww2ogg/${fileName}`,
      [`${uuid}/1.wem`, "--pcb", "packed_codebooks_aoTuV_603.bin"],
      function (a1, a2, a3) {
        if (a1 || a2 || a3) {
          console.log(a1);
          console.log(a2);
          console.log(a3);
        }
        resolve();
      }
    );
  });
}
