import styles from "./ImageSelector.module.scss";

interface ImageSelectorProps {
  left: number;
  top: number;
  image: any;
  onClick: () => void;
}

export default function ImageSelector({
  left,
  top,
  image,
  onClick,
}: ImageSelectorProps) {
  return (
    <div
      style={{ left: left + "px", top: top + "px" }}
      className={styles.selector}
      onClick={onClick}
    >
      <div className={styles.image}>
        {image && <img className={styles.test} src={image} />}
      </div>
    </div>
  );
}
