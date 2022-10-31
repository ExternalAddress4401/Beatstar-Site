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
  await fs.rename(audio.filepath, `./${uuid}/audio.bundle`);

  await extractAudio(uuid);
  await extractWem(uuid);
  await convertAudio(uuid);

  createReadStream(`${uuid}/1.ogg`)
    .pipe(res)
    .on("finish", function () {
      res.status(200);
      res.end();
    });
}

function parseForm(form: any, req: NextApiRequest) {
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
  return new Promise<void>(function (resolve, reject) {
    execFile(
      "tools/replacer/UnityAssetReplacer.exe",
      ["-b", `./${uuid}/audio.bundle`, "-d", `./${uuid}`, "-m", "m_Script"],
      async function (a1, a2, a3) {
        await fs.rename(`./${uuid}/TST00026`, `./${uuid}/TST00026.bnk`);
        resolve();
      }
    );
  });
}
async function extractWem(uuid: string) {
  return new Promise<void>(function (resolve, reject) {
    execFile(
      "tools/bnk/wwiseutil.exe",
      ["-u", "-f", `./${uuid}/TST00026.bnk`, "-o", `./${uuid}`],
      async function (a1, a2, a3) {
        resolve();
      }
    );
  });
}

async function convertAudio(uuid: string) {
  return new Promise<void>(function (resolve, reject) {
    execFile(
      "tools/ww2ogg/ww2ogg",
      [`${uuid}/1.wem`, "--pcb", "packed_codebooks_aoTuV_603.bin"],
      function (a1, a2, a3) {
        resolve();
      }
    );
  });
}
