import Image from "next/image";
import { getMedalForScore } from "../utils/getMedalForScore";
import styles from "./ScoreCard.module.scss";

interface ScoreCardProps {
  title: string;
  artist: string;
  beatmapInfo: any;
  songInfo: any;
  perfectPlus: number;
  perfect: number;
  great: number;
  tooEarly: number;
  score: number;
}

export default function ScoreCard({
  title,
  artist,
  beatmapInfo,
  songInfo,
  perfectPlus,
  perfect,
  great,
  tooEarly,
  score,
}: ScoreCardProps) {
  const gradient = songInfo.ColorGradient.ColorKeys.reduce((prev, curr) => {
    const color = curr.Color.split(/(..)/)
      .filter((c) => c)
      .map((c) => parseInt(c, 16));

    if (!curr.Time) {
      return prev + `rgba(${color[0]},${color[1]},${color[2]}, 1)` + " 0%, ";
    }
    return (
      prev +
      `rgba(${color[0]},${color[1]},${color[2]}, 1)` +
      " " +
      curr.Time * 100 +
      "%, "
    );
  }, "");

  const medal = getMedalForScore(score, beatmapInfo.Difficulty_id);

  let difficulty = {
    image: "",
    width: 0,
    height: 0,
  };

  switch (beatmapInfo.Difficulty_id) {
    case 1:
      difficulty = {
        image: "/images/extreme.png",
        width: 25,
        height: 25,
      };
      break;
    case 3:
      difficulty = {
        image: "/images/hard.png",
        width: 18,
        height: 25,
      };
      break;
  }
  return (
    <div
      className={styles.card}
      style={{
        background: `linear-gradient(90deg, ${gradient.slice(0, -2)}`,
      }}
    >
      <div className={styles.row}>
        <div className={styles.titleColumn}>
          <h2 className={styles.title}>{title}</h2>
          <hr style={{ width: "50%", margin: 0 }} />
          <h2 className={styles.title}>{artist}</h2>
          {difficulty.image && (
            <Image
              src={difficulty.image}
              width={difficulty.width}
              height={difficulty.height}
            />
          )}
          <div className={styles.score}>{perfectPlus} perfect plus</div>
          <div className={styles.score}>{perfect} perfect</div>
          <div className={styles.score}>{great} great</div>
          <div className={styles.score}>{tooEarly} too early</div>
        </div>
      </div>
      <div className={styles.scoreRow}>
        <h2 className={styles.score}>{score.toLocaleString()}</h2>
        {medal && <Image width={63} height={63} src={`/images/${medal}.png`} />}
      </div>
    </div>
  );
}
