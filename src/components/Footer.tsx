import styles from "./Footer.module.scss";

interface FooterProps {
  errors: string | string[];
}

export default function Footer({ errors }: FooterProps) {
  if (!errors) {
    return;
  }
  if (!Array.isArray(errors)) {
    errors = [errors];
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
