import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { promises as fs } from "fs";
import { execFile } from "child_process";
import { v4 as uuidv4 } from "uuid";
import JSZip from "jszip";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = formidable();

  const { files } = await parseForm(form, req);

  const uuid = uuidv4();

  try {
    if (Object.keys(files).length != 1) {
      throw Error("Not enough files uploaded.");
    }

    //create the main directory structure
    await buildDirectoryStructure(uuid);
    //copy the uploaded files into there
    //yes these need to be their own folders because of how the asset replacer works
    await fs.rename(
      files.artwork.filepath,
      `./${uuid}/artwork/FooFighter_Everlong.png`
    );

    const promises = [replaceArtwork(uuid)];

    Promise.all(promises).then(async function () {
      try {
        const zip = new JSZip();
        zip.file(
          "artwork.bundle",
          await fs.readFile(`./${uuid}/artwork.bundle`)
        );

        zip
          .generateNodeStream({ type: "nodebuffer", streamFiles: true })
          .pipe(res)
          .on("finish", function () {
            fs.rm(`./${uuid}`, { recursive: true });
            res.status(200);
            res.end();
          });
      } catch (e) {
        console.log("ERROR", e);
        await fs.rm(`./${uuid}`, { recursive: true });
        res
          .status(500)
          .json({ errors: ["Something went wrong encrypting your chart."] });
        res.end();
      }
    });
  } catch (e) {
    console.log("ERROR", e);
    await fs.rm(`./${uuid}`, { recursive: true });
    res
      .status(500)
      .json({ errors: ["Something went wrong encrypting your chart."] });
    res.end();
  }
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

async function buildDirectoryStructure(uuid: string) {
  await fs.mkdir(`./${uuid}/`);
  await fs.mkdir(`./${uuid}/artwork`);
}

async function replaceArtwork(uuid: string) {
  const fileName =
    process.platform === "linux"
      ? "UnityAssetReplacer"
      : "UnityAssetReplacer.exe";
  const newContainerName = uuidv4().replaceAll("-", "");
  const container = /a317cdbf067bab183d6dd12d870c1303/g;

  return new Promise<void>(function (resolve, reject) {
    execFile(
      `tools/replacer/${fileName}`,
      [
        "-b",
        "original/artwork.bundle",
        "-i",
        uuid + "/artwork",
        "-t",
        "-o",
        uuid + "/artwork.bundle",
      ],
      async function (a1, a2, a3) {
        console.log(a1, a2, a3);

        let data = (await fs.readFile(`./${uuid}/artwork.bundle`)).toString(
          "binary"
        );
        data = data.replace(container, newContainerName);
        await fs.writeFile(`./${uuid}/artwork.bundle`, data, "binary");

        resolve();
      }
    );
  });
}
