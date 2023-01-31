import { NextPageContext } from "next";
import axios from "axios";
import { useCache } from "../../../hooks/useCache";
import ScoreCard from "../../../components/ScoreCard";

import styles from "./index.module.scss";

interface ScoresProps {
  scores: {
    score: number;
    beatmapId: number;
    perfectPlus: number;
    perfect: number;
    great: number;
    tooEarly: number;
  }[];
}

export default function Scores({ scores }: ScoresProps) {
  const { songs, language } = useCache();

  if (!songs) {
    return;
  }

  return (
    <div className={styles.scoreContainer}>
      {scores.map((score) => {
        const { Song_id } = songs.Beatmaps.find(
          (el) => el.id === score.beatmapId
        );
        const { songTitleLocId, songArtistLocId } = songs.Songs.find(
          (song) => song.id === Song_id
        );
        const title = language.strings.find(
          (el) => el.placeholder === songTitleLocId
        ).message.message;

        const artist = language.strings.find(
          (el) => el.placeholder === songArtistLocId
        ).message.message;

        const songInfo = songs.Songs.find((el) => el.id === Song_id);
        const beatmapInfo = songs.BeatmapVariants.find(
          (el) => el.Song_id === Song_id
        );

        return (
          <ScoreCard
            title={title}
            artist={artist}
            beatmapInfo={beatmapInfo}
            songInfo={songInfo}
            perfectPlus={score.perfectPlus}
            perfect={score.perfect}
            great={score.great}
            tooEarly={score.tooEarly}
            score={score.score}
          />
        );
      })}
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const androidId = context.query.androidId;

  const scores = (
    await axios.post("http://localhost:4000/getSiteScores", {
      id: androidId,
    })
  ).data;

  return {
    props: {
      scores,
    },
  };
}
