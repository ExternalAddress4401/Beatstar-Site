import { useState, useEffect } from "react";
import axios from "axios";

export function useCache() {
  const [assets, setAssets] = useState(null);
  const [songs, setSongs] = useState(null);
  const [language, setLanguage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (sessionStorage.getItem("cachedSongs")) {
        setAssets(JSON.parse(sessionStorage.getItem("cachedAssets")));
        setSongs(JSON.parse(sessionStorage.getItem("cachedSongs")));
        setLanguage(JSON.parse(sessionStorage.getItem("cachedLanguage")));
      } else {
        const assetsPatchConfig = (
          await axios.post("/api/read-cms-file", {
            name: "AssetsPatchConfig",
          })
        ).data;
        const assetsConfig = assetsPatchConfig.assetBundles.filter(
          (el) =>
            el.id.includes("interactions") ||
            el.id.includes("audiobank") ||
            el.id.includes("artwork")
        );
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
        setAssets(assetsConfig);
        setSongs(songConfig);
        setLanguage(langConfig);
        sessionStorage.setItem("cachedSongs", JSON.stringify(songConfig));
        sessionStorage.setItem("cachedAssets", JSON.stringify(assetsConfig));
        sessionStorage.setItem("cachedLanguage", JSON.stringify(langConfig));
      }
    };
    fetchData();
  }, []);

  return [assets, songs, language];
}
