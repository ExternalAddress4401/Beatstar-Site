import styles from "./Tile.module.scss";

interface TileProps {
  id: string;
  topOffset: number;
}

export default function Tile({ id, topOffset }: TileProps) {
  return (
    <div
      className={styles.tile}
      aria-label={id}
      style={{ top: -topOffset + "px" }}
    >
      <div className={styles.innerTile}>
        <div className={styles.line} />
      </div>
    </div>
  );
}
