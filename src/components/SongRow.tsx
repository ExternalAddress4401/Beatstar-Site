import Image from "next/image";
import LocalLink from "./LocalLink";
import styles from "./SongRow.module.scss";
import { useCache } from "../hooks/useCache";

interface SongRowProps {
  title: string;
  artist: string;
  idLabel: string;
  difficulty: {
    image: string;
    width: number;
    height: number;
  };
  audio: any;
  chart: any;
  assets: any;
}

export default function SongRow({
  title,
  artist,
  idLabel,
  difficulty = {
    image: null,
    width: 0,
    height: 0,
  },
  audio,
  chart,
  assets,
}: SongRowProps) {
  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <div>
          <LocalLink href={`/songs/${idLabel}`} label={title} />{" "}
          {difficulty.image && (
            <Image
              src={difficulty.image}
              width={difficulty.width}
              height={difficulty.height}
            />
          )}
        </div>

        <div>{artist}</div>
      </div>
      <div className={styles.end}>
        <a
          className={styles.link}
          href={`${assets.downloadUrl}/${assets.downloadBucketVersion}/Android/${audio.id}_${audio.HashAndroid}${audio.CRCAndroid}.bundle`}
        >
          {audio.id === "unknown" ? "Unknown" : "Audio"}
        </a>
        <a
          className={styles.link}
          href={`${assets.downloadUrl}/${assets.downloadBucketVersion}/Android/${chart.id}_${chart.HashAndroid}${chart.CRCAndroid}.bundle`}
        >
          {chart.id === "unknown" ? "Unknown" : "Chart"}
        </a>
      </div>
    </div>
  );
}
