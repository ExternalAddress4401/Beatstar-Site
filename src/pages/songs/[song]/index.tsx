import { NextPageContext } from "next";
import { readCmsFile } from "../../../utils/readCmsFile";
import { ProtobufReader, ChartProto } from "@externaladdress4401/protobuf";
import axios from "axios";
import { extract, extractTextures } from "../../../utils/extract";
import { roundToPlaces } from "../../../utils/roundToPlaces";
import styles from "./index.module.scss";
import { useCache } from "../../../hooks/useCache";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import SongCard from "../../../components/SongCard";

interface SongProps {
  idLabel: string;
  artwork: string;
  chartData: any;
}

export default function Song({ idLabel, artwork, chartData }: SongProps) {
  const { assets, songs, language } = useCache();

  if (!assets) {
    return <div></div>;
  }

  const song = songs.Beatmaps.find((el) => el.idLabel === idLabel);
  const songInfo = songs.Songs.find((el) => el.id === song.Song_id);
  const beatmapInfo = songs.BeatmapVariants.find(
    (el) => el.Song_id === song.Song_id
  );

  const { songTitleLocId, songArtistLocId } = songs.Songs.find(
    (el) => el.id === song.Song_id
  );

  const title = language.strings.find((el) => el.placeholder === songTitleLocId)
    .message.message;

  const artist = language.strings.find(
    (el) => el.placeholder === songArtistLocId
  ).message.message;

  return (
    <div className={styles.content}>
      <SongCard
        title={title}
        artist={artist}
        artwork={artwork}
        chartData={chartData}
        beatmapInfo={beatmapInfo}
        songInfo={songInfo}
      />
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const jobId = uuidv4();

  const idLabel = context.query.song;
  const assets = await readCmsFile("AssetsPatchConfig");
  const songs = await readCmsFile("SongConfig");

  const song = songs.Beatmaps.find((beatmap) => beatmap.idLabel === idLabel);

  const asset = assets.assets.find(
    (el) =>
      el.name ===
      `Assets/beatmapInteractions/${song.BeatmapVariantReference_id}.bytes`
  );

  const realAsset = assets.assetBundles.find((el) => el.id === asset.id);

  console.log(song, realAsset);

  const chartUrl = `https://assets.flamingo.apelabs.net/flamingo-asset-bundles/prod/3/Android/${realAsset.id}_${realAsset.HashAndroid}${realAsset.CRCAndroid}.bundle`;
  const chartData = (await axios.get(chartUrl, { responseType: "arraybuffer" }))
    .data;

  //extract chart

  const data = await extract(jobId, chartData);

  const reader = new ProtobufReader(data);
  reader.process();

  const parsed = reader.parseProto(ChartProto);

  //get the album art

  /*const artwork = assets.assetBundles.find((asset) =>
    asset.id.startsWith(`${song.Song_id}_artwork`)
  );

  let finalArtwork;
  if (!artwork || !artwork.HashAndroid) {
    finalArtwork = (
      await fs.readFile("public/images/placeholder.png")
    ).toString("base64");
  } else {
    const artworkUrl = `https://assets.flamingo.apelabs.net/flamingo-asset-bundles/prod/0/Android/${artwork.id}_${artwork.HashAndroid}${artwork.CRCAndroid}.bundle`;
    const artworkData = (
      await axios.get(artworkUrl, {
        responseType: "arraybuffer",
      })
    ).data;

    finalArtwork = await extractTextures(jobId, artworkData);
  }*/

  fs.rm(`./${jobId}`, { recursive: true, force: true });

  return {
    props: {
      chartData: parsed,
      //artwork: finalArtwork,
      idLabel,
    },
  };
}
