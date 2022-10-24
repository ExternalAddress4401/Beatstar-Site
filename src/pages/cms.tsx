import styles from "./cms.module.scss";
import { CMSRequester } from "@externaladdress4401/protobuf";

interface CMSProps {
  cms: {
    name: string;
    version: string;
    hash: string;
    url: string;
  }[];
}

export default function cms({ cms }: CMSProps) {
  return (
    <div className={styles.container}>
      <h1>CMS</h1>
      <div className={styles.grid}>
        {cms.map((el) => (
          <>
            <div>{el.name}</div>
            <div>{el.version}</div>
          </>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const cms = await CMSRequester.getCMS();

  return {
    props: {
      cms,
    },
  };
}
