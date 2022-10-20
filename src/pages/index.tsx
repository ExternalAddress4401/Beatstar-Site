import styles from "./index.module.scss";

export default function Home() {
  return (
    <div className={styles.content}>
      <img className={styles.image} src="images/background.png" />
    </div>
  );
}
