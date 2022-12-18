import Image from "next/image";
import { useCache } from "../hooks/useCache";
import { roundToPlaces } from "../utils/roundToPlaces";
import styles from "./SongCard.module.scss";

interface SongCardProps {
  title: string;
  artist: string;
  artwork: string;
  chartData: any;
  beatmapInfo: any;
  songInfo: any;
}

export default function SongCard({
  title,
  artist,
  artwork,
  chartData,
  beatmapInfo,
  songInfo,
}: SongCardProps) {
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
        <Image
          className={styles.image}
          src={`data:image/jpeg;base64,${artwork}`}
          width="200px"
          height="200px"
        />
        <div className={styles.titleColumn}>
          <h2 className={styles.title}>{title}</h2>
          <hr style={{ width: "50%" }} />
          <h2 className={styles.title}>{artist}</h2>
          {difficulty.image && (
            <Image
              src={difficulty.image}
              width={difficulty.width}
              height={difficulty.height}
            />
          )}
        </div>
      </div>
      <div className={styles.row}>
        <div>
          <div>Notes: {chartData.notes.length}</div>
          <div>
            Taps:{" "}
            {
              chartData.notes.filter(
                (note) => note.note_type === 1 && !note.single.swipe
              ).length
            }
          </div>
          <div>
            Swipes:{" "}
            {
              chartData.notes.filter(
                (note) => note.note_type === 1 && note.single.swipe
              ).length
            }
          </div>
          <div>
            Holds:{" "}
            {
              chartData.notes.filter(
                (note) => note.note_type === 2 && !note.long.swipe
              ).length
            }
          </div>
          <div>
            Hold swipes:{" "}
            {
              chartData.notes.filter(
                (note) => note.note_type === 2 && note.long.swipe
              ).length
            }
          </div>
          <div>
            Switch holds:{" "}
            {chartData.notes.filter((note) => note.note_type === 5).length}
          </div>
          <div>Effects: {chartData.effects.length}</div>
        </div>
        <div className={styles.sizeRow}>
          <div className={styles.column}>
            <div>Perfect sizes</div>
            <ul>
              {chartData.perfectSizes.map((el) => (
                <li key={el.offset}>{roundToPlaces(el.multiplier, 2)}</li>
              ))}
            </ul>
          </div>
          <div className={styles.column}>
            <div>Speeds</div>
            <ul>
              {chartData.speeds.map((el) => (
                <li key={el.offset}>{roundToPlaces(el.multiplier, 2)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
