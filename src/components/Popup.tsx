import styles from "./Popup.module.scss";

interface PopupProps {
  messages: string[];
}

export default function Popup({ messages }: PopupProps) {
  if (!messages || !messages.length) {
    return;
  }
  return (
    <div className={styles.popup}>
      <div className={styles.content}>
        <h1>Error</h1>
        {messages.map((message) => (
          <div>{message}</div>
        ))}
      </div>
    </div>
  );
}
