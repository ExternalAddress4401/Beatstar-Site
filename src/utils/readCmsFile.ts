import axios from "axios";
import {
  ProtobufReader,
  GameConfigProto,
  LangProto,
  AssetsPatchProto,
  AudioConfigProto,
  NewsProto,
  ScalingConfigProto,
  NotificationConfigProto,
  FontFallbackConfigProto,
  LiveOpsBundleConfigProto,
  LiveOpsEventProto,
  LiveOpsDeeplinkRewardProto,
  CMSRequester,
} from "@externaladdress4401/protobuf";
import { decompress } from "./decompress";

type CMSFile =
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
  | "LiveOpsDeepLinkRewardConfig";

export async function readCmsFile(name: CMSFile) {
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
      parsed = reader.parseProto(ScalingConfigProto);
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
    case "LiveOpsDeepLinkRewardConfig":
      parsed = reader.parseProto(LiveOpsDeeplinkRewardProto);
      break;
  }

  return parsed;
}
