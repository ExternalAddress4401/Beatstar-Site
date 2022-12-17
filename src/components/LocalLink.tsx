import Link from "next/link";

import styles from "./LocalLink.module.scss";

interface LinkProps {
  label: string;
  href: string;
}

export default function LocalLink({ label, href }: LinkProps) {
  return (
    <Link href={href}>
      <a className={styles.link}>{label}</a>
    </Link>
  );
}
