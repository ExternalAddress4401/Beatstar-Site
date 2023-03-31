import { useState, useEffect } from "react";
import axios from "axios";

export function useCache() {
  const [assets, setAssets] = useState(null);
  const [songs, setSongs] = useState(null);
  const [language, setLanguage] = useState(null);
  const bypassSessionStorage = true;

  useEffect(() => {
    const fetchData = async () => {
      if (!bypassSessionStorage && sessionStorage.getItem("cachedSongs")) {
        setAssets(JSON.parse(sessionStorage.getItem("cachedAssets")));
        setSongs(JSON.parse(sessionStorage.getItem("cachedSongs")));
        setLanguage(JSON.parse(sessionStorage.getItem("cachedLanguage")));
      } else {
        const assetsPatchConfig = (
          await axios.post("/api/read-cms-file", {
            name: "AssetsPatchConfig",
          })
        ).data;
        const songConfig = (
          await axios.post("/api/read-cms-file", {
            name: "SongConfig",
          })
        ).data;
        const langConfig = (
          await axios.post("/api/read-cms-file", {
            name: "LangConfig",
          })
        ).data;

        const assetsConfig = songConfig.Songs.map((song, index) => {
          const songEntry = songConfig.Beatmaps.find(
            (el) => el.Song_id === song.id
          );
          const audio = song.audioAsset_id;
          const chart = songConfig.BeatmapVariants.find(
            (el) =>
              el.InteractionsReference_id ==
              songEntry.BeatmapVariantReference_id
          ).InteractionsAsset_id;
          console.log(chart);
          const artwork = song.CoverArtAsset_id;

          return {
            id: song.id,
            audio: assetsPatchConfig.assetBundles.find((el) => el.id === audio),
            chart: assetsPatchConfig.assetBundles.find((el) => el.id === chart),
            artwork: assetsPatchConfig.assetBundles.find(
              (el) => el.id === artwork
            ),
          };
        });

        setSongs(songConfig);
        setLanguage(langConfig);
        setAssets(assetsConfig);
        sessionStorage.setItem("cachedSongs", JSON.stringify(songConfig));
        sessionStorage.setItem("cachedAssets", JSON.stringify(assetsConfig));
        sessionStorage.setItem("cachedLanguage", JSON.stringify(langConfig));
      }
    };
    fetchData();
  }, []);

  return { assets, songs, language };
}
