import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./index.module.scss";
import LocalLink from "../../components/LocalLink";
import Input from "../../components/Input";

export default function Songs() {
  const [assets, setAssets] = useState(null);
  const [songs, setSongs] = useState(null);
  const [language, setLanguage] = useState(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    async function fetchCms() {
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
          (el) => el.id.includes("interactions") || el.id.includes("audiobank")
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
    }
    fetchCms();
  }, []);
  if (!assets || !songs) {
    return <div></div>;
  }
  return (
    <div className={styles.content}>
      <h1>Songs</h1>
      <Input
        type="text"
        label="Search"
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
      />
      <table>
        {songs.Beatmaps.map((el) => {
          const { songTitleLocId, songArtistLocId } = songs.Songs.find(
            (song) => song.id === el.Song_id
          );
          const title = language.strings.find(
            (el) => el.placeholder === songTitleLocId
          ).message.message;
          if (!title.toLowerCase().includes(searchTerm)) {
            return;
          }
          const artist = language.strings.find(
            (el) => el.placeholder === songArtistLocId
          ).message.message;
          const chartId = el.BeatmapVariantReference_id;
          const songId = el.Song_id;
          let chart = assets.find((el) => el.id === `interactions_${chartId}`);
          let audio = assets.find((el) =>
            el.id.startsWith(`${songId}_audiobank`)
          );
          if (!chart) {
            chart = { id: "unknown" };
          }
          if (!audio) {
            audio = { id: "unknown" };
          }
          return (
            <tr key={songId}>
              <td>
                <LocalLink href={`/songs/${el.idLabel}`} label={title} />
              </td>
              <td>{artist}</td>
              <td>
                <a
                  className={styles.link}
                  href={`https://assets.flamingo.apelabs.net/flamingo-asset-bundles/prod/0/Android/${audio.id}_${audio.HashAndroid}${audio.CRCAndroid}.bundle`}
                >
                  {audio.id === "unknown" ? "Unknown" : "Audio"}
                </a>
              </td>
              <td>
                <a
                  className={styles.link}
                  href={`https://assets.flamingo.apelabs.net/flamingo-asset-bundles/prod/0/Android/${chart.id}_${chart.HashAndroid}${chart.CRCAndroid}.bundle`}
                >
                  {chart.id === "unknown" ? "Unknown" : "Chart"}
                </a>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
