import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { promises as fs } from "fs";
import { execFile } from "child_process";
import { v4 as uuidv4 } from "uuid";
import JSZip from "jszip";
import { ProtobufWriter, ChartProto } from "@externaladdress4401/protobuf";
import { buildChart } from "../../lib/ChartBuilder";
import { readChart } from "../../lib/ChartReader";

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
  const legacyRails = fields.legacyRails === "true" ? true : false;

  const uuid = uuidv4();

  try {
    if (Object.keys(files).length != 1) {
      throw Error("Not enough files uploaded.");
    }

    //create the main directory structure
    await buildDirectoryStructure(uuid);
    //copy the uploaded files into there
    //yes these need to be their own folders because of how the asset replacer works
    await fs.rename(files.chart.filepath, `./${uuid}/chart/508`);

    if (files.chart.originalFilename.endsWith(".json")) {
      const chart = JSON.parse(
        (await fs.readFile(`./${uuid}/chart/508`)).toString()
      );
      const writer = new ProtobufWriter(chart);
      writer.build(ChartProto);

      await fs.writeFile(`${uuid}/chart/508`, writer.buffer);
    } else {
      await parseChart(uuid, parseInt(fields.difficulty), legacyRails);
    }

    const promises = [replaceChart(uuid)];

    Promise.all(promises).then(async function () {
      try {
        const zip = new JSZip();
        zip.file("chart.bundle", await fs.readFile(`./${uuid}/chart.bundle`));

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
        await fs.rm(`./${uuid}`, { recursive: true, force: true });
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

async function parseChart(
  uuid: string,
  difficulty: number,
  useLegacyRails: boolean
) {
  const chart = readChart(
    (await fs.readFile(`./${uuid}/chart/508`)).toString(),
    useLegacyRails
  );

  // for now we'll add in the default speeds and perfect sizes here

  const difficultyTable = {
    1: {
      speeds: [0.6, 0.55, 0.5, 0.5, 0.45],
      perfectSizes: [0.9, 0.8, 0.7, 0.6, 0.6],
    },
    3: {
      speeds: [0.7, 0.6, 0.55, 0.5, 0.45],
      perfectSizes: [0.9, 0.8, 0.7, 0.6, 0.6],
    },
    4: {
      speeds: [0.8, 0.7, 0.6, 0.55, 0.5],
      perfectSizes: [1, 0.9, 0.8, 0.7, 0.6],
    },
  };

  const relevantTableEntry = difficultyTable[difficulty];

  // no user set speeds were found
  if (!chart.speeds.length) {
    chart.speeds = chart.sections.map((section, index) => {
      if (index === 0) {
        return {
          multiplier: relevantTableEntry.speeds[index],
          adjustedOffset: section.offset,
        };
      } else {
        return {
          offset: section.offset,
          multiplier: relevantTableEntry.speeds[index],
          adjustedOffset: section.offset,
        };
      }
    });
  }
  // no user set perfect sizes were found
  if (!chart.perfectSizes.length) {
    chart.perfectSizes = chart.sections.map((section, index) => {
      if (index === 0) {
        return {
          multiplier: relevantTableEntry.perfectSizes[index],
          adjustedOffset: section.offset,
        };
      } else {
        return {
          offset: section.offset,
          multiplier: relevantTableEntry.perfectSizes[index],
          adjustedOffset: section.offset,
        };
      }
    });
  }

  try {
    const writer = new ProtobufWriter(buildChart(chart));
    writer.build(ChartProto);

    await fs.writeFile(`${uuid}/chart/508`, writer.buffer);

    return chart;
  } catch (e) {
    console.log(e);
  }
}
