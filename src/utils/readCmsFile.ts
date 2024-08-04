import axios from "axios";
import {
  ProtobufReader,
  GameConfigProto,
  LangProto,
  AssetsPatchProto,
  AudioConfigProto,
  NewsProto,
  ScalingConfig,
  NotificationConfigProto,
  FontFallbackConfigProto,
  LiveOpsBundleConfigProto,
  LiveOpsEventProto,
  LiveOpsDeeplinkRewardConfigProto,
  SongConfigProto,
  CMSRequester,
} from "@externaladdress4401/protobuf";
import { decompress } from "./decompress";
import { promises as fs } from "fs";

export type CMSFileName =
  | "GameConfig"
  | "LangConfig"
  | "AssetsPatchConfig"
  | "AudioConfig"
  | "NewsFeed"
  | "ScalingConfig"
  | "NotificationConfig"
  | "FontFallbackConfig"
  | "LiveOpsBundleConfig"
  | "LiveOpsEventConfig"
  | "LiveOpsDeeplinkRewardConfig"
  | "SongConfig";

type Game = "Beatstar" | "Countrystar";

export async function readCmsFile(name: CMSFileName, game: Game = "Beatstar") {
  const ip =
    game === "Countrystar"
      ? "socket-gateway.prod.robin.apelabs.net"
      : "socket-gateway.prod.flamingo.apelabs.net";

  console.log(await CMSRequester.getCMS(ip));

  const { url } = (await CMSRequester.getCMS(ip)).find(
    (el) => el.name === name
  );
  const version = url.split("?")[0].split("/")[7];

  let cmsData;
  try {
    cmsData = await fs.readFile(`./cache/${name}/${version}`);
  } catch (e) {
    cmsData = await decompress(
      (
        await axios.get(url, { responseType: "arraybuffer" })
      ).data
    );
    await fs.writeFile(`./cache/${name}/${version}`, cmsData);
  }

  const reader = new ProtobufReader(cmsData);
  reader.process();

  switch (name) {
    case "GameConfig":
      cmsData = reader.parseProto(GameConfigProto);
      break;
    case "LangConfig":
      cmsData = reader.parseProto(LangProto);
      break;
    case "AssetsPatchConfig":
      cmsData = reader.parseProto(AssetsPatchProto);
      break;
    case "AudioConfig":
      cmsData = reader.parseProto(AudioConfigProto);
      break;
    case "NewsFeed":
      cmsData = reader.parseProto(NewsProto);
      break;
    case "ScalingConfig":
      cmsData = reader.parseProto(ScalingConfig);
      break;
    case "NotificationConfig":
      cmsData = reader.parseProto(NotificationConfigProto);
      break;
    case "FontFallbackConfig":
      cmsData = reader.parseProto(FontFallbackConfigProto);
      break;
    case "LiveOpsBundleConfig":
      cmsData = reader.parseProto(LiveOpsBundleConfigProto);
      break;
    case "LiveOpsEventConfig":
      cmsData = reader.parseProto(LiveOpsEventProto);
      break;
    case "LiveOpsDeeplinkRewardConfig":
      cmsData = reader.parseProto(LiveOpsDeeplinkRewardConfigProto);
      break;
    case "SongConfig":
      cmsData = reader.parseProto(SongConfigProto);
      break;
  }

  return cmsData;
}
