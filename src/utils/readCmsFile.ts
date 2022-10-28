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

export async function readCmsFile(name: CMSFileName) {
  const { url } = (await CMSRequester.getCMS()).find((el) => el.name === name);
  const data = await decompress(
    (
      await axios.get(url, { responseType: "arraybuffer" })
    ).data
  );

  const reader = new ProtobufReader(data);
  reader.process();

  let parsed;

  switch (name) {
    case "GameConfig":
      parsed = reader.parseProto(GameConfigProto);
      break;
    case "LangConfig":
      parsed = reader.parseProto(LangProto);
      break;
    case "AssetsPatchConfig":
      parsed = reader.parseProto(AssetsPatchProto);
      break;
    case "AudioConfig":
      parsed = reader.parseProto(AudioConfigProto);
      break;
    case "NewsFeed":
      parsed = reader.parseProto(NewsProto);
      break;
    case "ScalingConfig":
      parsed = reader.parseProto(ScalingConfig);
      break;
    case "NotificationConfig":
      parsed = reader.parseProto(NotificationConfigProto);
      break;
    case "FontFallbackConfig":
      parsed = reader.parseProto(FontFallbackConfigProto);
      break;
    case "LiveOpsBundleConfig":
      parsed = reader.parseProto(LiveOpsBundleConfigProto);
      break;
    case "LiveOpsEventConfig":
      parsed = reader.parseProto(LiveOpsEventProto);
      break;
    case "LiveOpsDeeplinkRewardConfig":
      parsed = reader.parseProto(LiveOpsDeeplinkRewardConfigProto);
      break;
    case "SongConfig":
      parsed = reader.parseProto(SongConfigProto);
      break;
  }

  return parsed;
}
