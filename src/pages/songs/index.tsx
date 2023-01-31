import { useState } from "react";
import styles from "./index.module.scss";
import Input from "../../components/Input";
import { useCache } from "../../hooks/useCache";
import BasicLoader from "../../components/BasicLoader";
import SongRow from "../../components/SongRow";

export default function Songs() {
  const { assets, songs, language } = useCache();
  const [searchTerm, setSearchTerm] = useState<string>("");

  if (!assets || !songs) {
    return (
      <div className={styles.loader}>
        <BasicLoader />
      </div>
    );
  }
  return (
    <div className={styles.content}>
      <h1>Songs</h1>
      <Input
        type="text"
        label="Search"
        onChange={(e) => setSearchTerm(e.currentTarget.value.toLowerCase())}
      />
      <div className={styles.table}>
        {songs.Beatmaps.map((el) => {
          const { songTitleLocId, songArtistLocId } = songs.Songs.find(
            (song) => song.id === el.Song_id
          );
          const title = language.strings.find(
            (el) => el.placeholder === songTitleLocId
          ).message.message;
          const beatmapInfo = songs.BeatmapVariants.find(
            (s) => s.Song_id === el.Song_id
          );

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
          let difficulty = {
            image: "",
            width: 0,
            height: 0,
          };

          const pro = beatmapInfo.Description
            ? beatmapInfo.Description.toLowerCase().includes("pro")
            : "";

          switch (beatmapInfo.Difficulty_id) {
            case 1:
              difficulty = {
                image: "/images/extreme.png",
                width: 12,
                height: 12,
              };
              break;
            case 3:
              difficulty = {
                image: "/images/hard.png",
                width: 9,
                height: 13,
              };
              break;
          }

          if (!chart) {
            chart = { id: "unknown" };
          }
          if (!audio) {
            audio = { id: "unknown" };
          }
          return (
            <SongRow
              key={el.idLabel}
              title={title + (pro ? " - PRO" : "")}
              artist={artist}
              idLabel={el.idLabel}
              difficulty={difficulty}
              audio={audio}
              chart={chart}
            />
          );
        })}
      </div>
    </div>
  );
}
