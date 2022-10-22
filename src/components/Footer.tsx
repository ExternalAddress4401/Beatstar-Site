import styles from "./Footer.module.scss";

interface FooterProps {
  errors: string[];
}

export default function Footer({ errors }: FooterProps) {
  if (!errors) {
    return;
  }
  return (
    <div className={styles.footer}>
      <div className={styles.content}>
        <i className="fa-solid fa-x"></i>
        {errors}
      </div>
    </div>
  );
}
