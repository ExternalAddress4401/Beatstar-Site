import { NextPageContext } from "next";
import { readCmsFile } from "../../../utils/readCmsFile";
import { ProtobufReader, ChartProto } from "@externaladdress4401/protobuf";
import axios from "axios";
import { extract } from "../../../utils/extract";
import { roundToPlaces } from "../../../utils/roundToPlaces";
import styles from "./index.module.scss";

interface SongProps {
  idLabel: string;
  chartData: any;
}

export default function Song({ idLabel, chartData }: SongProps) {
  return (
    <div className={styles.content}>
      <h1>{idLabel}</h1>
      <div>Notes: {chartData.notes.length}</div>
      <div>
        Taps:{" "}
        {
          chartData.notes.filter(
            (note) => note.note_type === 1 && !note.single.swipe
          ).length
        }
      </div>
      <div>
        Swipes:{" "}
        {
          chartData.notes.filter(
            (note) => note.note_type === 1 && note.single.swipe
          ).length
        }
      </div>
      <div>
        Holds:{" "}
        {
          chartData.notes.filter(
            (note) => note.note_type === 2 && !note.long.swipe
          ).length
        }
      </div>
      <div>
        Hold swipes:{" "}
        {
          chartData.notes.filter(
            (note) => note.note_type === 2 && note.long.swipe
          ).length
        }
      </div>
      <div>
        Switch holds:{" "}
        {chartData.notes.filter((note) => note.note_type === 5).length}
      </div>
      <div>Effects: {chartData.effects.length}</div>
      <div>Perfect sizes: </div>
      <ul>
        {chartData.perfectSizes.map((el) => (
          <li>{roundToPlaces(el.multiplier, 2)}</li>
        ))}
      </ul>
      <div>Speeds: </div>
      <ul>
        {chartData.speeds.map((el) => (
          <li>{roundToPlaces(el.multiplier, 2)}</li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const idLabel = context.query.song;
  const assets = await readCmsFile("AssetsPatchConfig");
  const songs = await readCmsFile("SongConfig");
  const song = songs.Beatmaps.find((beatmap) => beatmap.idLabel === idLabel);
  const chart = assets.assetBundles.find(
    (asset) => asset.id === `interactions_${song.BeatmapVariantReference_id}`
  );
  const chartUrl = `https://assets.flamingo.apelabs.net/flamingo-asset-bundles/prod/0/Android/${chart.id}_${chart.HashAndroid}${chart.CRCAndroid}.bundle`;
  const chartData = (await axios.get(chartUrl, { responseType: "arraybuffer" }))
    .data;

  //extract chart

  const data = await extract(chartData);

  const reader = new ProtobufReader(data);
  reader.process();

  const parsed = reader.parseProto(ChartProto);

  return {
    props: {
      chartData: parsed,
      idLabel,
    },
  };
}
