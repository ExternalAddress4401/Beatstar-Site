import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { promises as fs } from "fs";
import { execFile } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { ProtobufReader, ChartProto } from "@externaladdress4401/protobuf";

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

  const chart = files.chart;

  const uuid = uuidv4();

  await fs.mkdir(`./${uuid}`);
  await fs.mkdir(`./${uuid}/input`);
  await fs.mkdir(`./${uuid}/output`);
  await fs.rename(chart.filepath, `./${uuid}/input/chart.bundle`);

  let data;

  if (chart.originalFilename.endsWith(".bytes")) {
    data = await fs.readFile(`./${uuid}/input/chart.bundle`);
  } else {
    await extractChart(uuid);

    try {
      data = await fs.readFile(
        `./${uuid}/output/ExportedProject/Assets/TextAsset/` +
          (
            await fs.readdir(
              `./${uuid}/output/ExportedProject/Assets/TextAsset`
            )
          ).filter((file) => file.endsWith(".bytes"))[0]
      );
    } catch (e) {
      data = await fs.readFile(
        `./${uuid}/output/ExportedProject/Assets/beatmapinteractions/` +
          (
            await fs.readdir(
              `./${uuid}/output/ExportedProject/Assets/beatmapinteractions`
            )
          ).filter((file) => file.endsWith(".bytes"))[0]
      );
    }
  }

  const reader = new ProtobufReader(data);
  reader.process();

  const parsed = reader.parseProto(ChartProto);

  await fs.rm(`./${uuid}`, { recursive: true, force: true });

  res.json(parsed);
  res.end();
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

async function extractChart(uuid: string) {
  const fileName =
    process.platform === "linux"
      ? "linux/AssetRipper"
      : "windows/AssetRipper.exe";
  return new Promise<void>(function (resolve, reject) {
    execFile(
      `tools/extractor/${fileName}`,
      [`./${uuid}/input/chart.bundle`, "-o", `./${uuid}/output`, "-q"],
      async function (a1, a2, a3) {
        console.log(a1, a2, a3);
        resolve();
      }
    );
  });
}
