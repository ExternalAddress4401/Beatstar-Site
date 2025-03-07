import { useState } from "react";
import styles from "./index.module.scss";
import Input from "../../components/Input";
import { useCache } from "../../hooks/useCache";
import BasicLoader from "../../components/BasicLoader";
import SongRow from "../../components/SongRow";
import Tabs from "../../components/Tabs";

export default function Songs() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [game, setGame] = useState<"Beatstar" | "Countrystar">("Beatstar");
  const { assets, songs, language } = useCache(game);

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
      <Tabs
        options={["Beatstar", "Countrystar"]}
        selected={game}
        onSelect={(value) => setGame(value as "Beatstar" | "Countrystar")}
      />
      <Input
        type="text"
        label="Search"
        onChange={(e) => setSearchTerm(e.currentTarget.value.toLowerCase())}
      />
      <div className={styles.table}>
        {songs.Beatmaps.map((song) => {
          const { songTitleLocId, songArtistLocId } = songs.Songs.find(
            (el) => el.id === song.Song_id
          );
          const title = language.strings.find(
            (el) => el.placeholder === songTitleLocId
          ).message.message;
          const beatmapInfo = songs.BeatmapVariants.find(
            (s) => s.Song_id === song.Song_id
          );

          if (!title.toLowerCase().includes(searchTerm)) {
            return;
          }
          const artist = language.strings.find(
            (el) => el.placeholder === songArtistLocId
          ).message.message;

          let chart = assets.find((el) => el.id === song.Song_id)?.chart;
          let audio = assets.find((el) => el.id === song.Song_id)?.audio;
          let difficulty = {
            image: "",
            width: 0,
            height: 0,
          };

          if (!beatmapInfo) {
            return null;
          }

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
              key={song.idLabel}
              title={title + (pro ? " - PRO" : "")}
              artist={artist}
              idLabel={song.idLabel}
              difficulty={difficulty}
              audio={audio}
              chart={chart}
              assets={assets[0]}
            />
          );
        })}
      </div>
    </div>
  );
}
