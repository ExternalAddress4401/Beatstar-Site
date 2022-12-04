import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { promises as fs } from "fs";
import { execFile } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { ProtobufWriter, ChartProto } from "@externaladdress4401/protobuf";
import { Chart } from "../../lib/ChartReader";
import { readChart } from "../../lib/ChartReader";
import { buildChart } from "../../lib/ChartBuilder";
import { SongInfo } from "../encrypt";
import { getMaxScore } from "../../lib/ChartUtils";
import JSZip from "jszip";

interface BuiltSongInfo extends SongInfo {
  bpm: number;
  sections: number;
  maxScore: number;
  numLanes: number;
}

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

  const { files, fields } = await parseForm(form, req);
  const info = JSON.parse(fields.info);

  //files should have 3 files
  if (Object.keys(files).length != 3) {
    throw Error("Not enough files uploaded.");
  }

  const uuid = fields.uuid;

  //create the main directory structure
  await buildDirectoryStructure(uuid);

  try {
    //copy the uploaded files into there
    //yes these need to be their own folders because of how the asset replacer works
    await fs.rename(
      files.artwork.filepath,
      `./${uuid}/artwork/FooFighter_Everlong.png`
    );

    await fs.rename(files.audio.filepath, `./${uuid}/audio/bnk/1.wem`);
    await fs.rename(files.chart.filepath, `./${uuid}/chart/508`);

    //convert the chart to beatstars format
    const chart = await parseChart(uuid);

    const numLanes = chart.notes.reduce(
      (prev, curr) => (curr.lane > prev ? curr.lane : prev),
      0
    );

    const promises = [
      replaceChart(uuid),
      replaceArtwork(uuid),
      replaceAudio(uuid),
    ];

    Promise.all(promises).then(async function () {
      const finalInfo: BuiltSongInfo = {
        title: info.title,
        artist: info.artist,
        id: info.id,
        difficulty: info.difficulty,
        bpm: chart.bpms[0].change,
        sections: chart.sections.length,
        maxScore: getMaxScore(chart, info.difficulty),
        numLanes: numLanes % 2 === 0 ? numLanes + 1 : numLanes,
      };

      const zip = new JSZip();
      zip.file("artwork.bundle", await fs.readFile(`./${uuid}/artwork.bundle`));
      zip.file("audio.bundle", await fs.readFile(`./${uuid}/audio.bundle`));
      zip.file("chart.bundle", await fs.readFile(`./${uuid}/chart.bundle`));
      zip.file("info.json", JSON.stringify(finalInfo));

      zip
        .generateNodeStream({ type: "nodebuffer", streamFiles: true })
        .pipe(res)
        .on("finish", function () {
          fs.rm(`./${uuid}`, { recursive: true, force: true });
          res.status(200);
          res.end();
        });
    });
  } catch (e) {
    await fs.rm(`./${uuid}`, { recursive: true, force: true });
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

async function parseChart(uuid: string) {
  const chart: Chart = readChart(
    (await fs.readFile(`./${uuid}/chart/508`)).toString()
  );

  try {
    const writer = new ProtobufWriter(buildChart(chart));
    writer.build(ChartProto);

    await fs.writeFile(`${uuid}/chart/508`, writer.buffer);

    return chart;
  } catch (e) {
    console.log(e);
  }
}

async function buildDirectoryStructure(uuid: string) {
  await fs.mkdir(`./${uuid}/`);
  await fs.mkdir(`./${uuid}/artwork`);
  await fs.mkdir(`./${uuid}/audio`);
  await fs.mkdir(`./${uuid}/audio/bnk`);
  await fs.mkdir(`./${uuid}/audio/edited`);
  await fs.mkdir(`./${uuid}/chart`);
}

async function replaceChart(uuid: string) {
  const fileName =
    process.platform === "linux"
      ? "UnityAssetReplacer"
      : "UnityAssetReplacer.exe";
  const newContainerName = uuidv4().replaceAll("-", "");
  const container = /0207725071a623d62e45b4a33e9c7b85/g;

  return new Promise<void>(function (resolve, reject) {
    execFile(
      `tools/replacer/${fileName}`,
      [
        "-b",
        "original/chart.bundle",
        "-i",
        uuid + "/chart",
        "-m",
        "m_Script",
        "-o",
        uuid + "/chart.bundle",
      ],
      async function (a1, a2, a3) {
        console.log(a1, a2, a3);

        let data = (await fs.readFile(`./${uuid}/chart.bundle`)).toString(
          "binary"
        );
        data = data.replace(container, newContainerName);
        await fs.writeFile(`./${uuid}/chart.bundle`, data, "binary");

        resolve();
      }
    );
  });
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

async function replaceAudio(uuid: string) {
  const fileName = process.platform === "linux" ? "wwiseutil" : "wwiseutil.exe";
  const replacerName =
    process.platform === "linux"
      ? "UnityAssetReplacer"
      : "UnityAssetReplacer.exe";
  const newContainerName = uuidv4().replaceAll("-", "");
  const container = /f742e8322104e675c6e8a37ba2cebb96/g;

  return new Promise<void>(function (resolve, reject) {
    execFile(
      `tools/bnk/${fileName}`,
      [
        "-f",
        "original/audio.bnk",
        "-r",
        "-t",
        uuid + "/audio/bnk",
        "-o",
        uuid + "/audio/edited/TST00026",
      ],
      async function (e) {
        if (e) {
          throw e;
        }
        //BNK has been replaced
        execFile(
          `tools/replacer/${replacerName}`,
          [
            "-b",
            "original/audio.bundle",
            "-i",
            uuid + "/audio/edited/",
            "-m",
            "m_Script",
            "-o",
            uuid + "/audio.bundle",
          ],
          async function (a1, a2, a3) {
            console.log(a1, a2, a3);

            let data = (await fs.readFile(`./${uuid}/audio.bundle`)).toString(
              "binary"
            );
            data = data.replace(container, newContainerName);
            await fs.writeFile(`./${uuid}/audio.bundle`, data, "binary");

            resolve();
          }
        );
      }
    );
  });
}
