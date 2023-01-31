import styles from "./cms.module.scss";
import { CMSRequester } from "@externaladdress4401/protobuf";
import Button from "../components/Button";
import { useState } from "react";
import axios from "axios";
import { CMSFileName } from "../utils/readCmsFile";
import TextArea from "../components/TextArea";
import BasicLoader from "../components/BasicLoader";

interface CMSProps {
  cms: {
    name: CMSFileName;
    version: string;
    hash: string;
    url: string;
  }[];
}

export default function Cms({ cms }: CMSProps) {
  const [selectedCms, setSelectedCms] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const readCms = async (name: CMSFileName) => {
    setIsLoading(true);
    const response = await axios.post("/api/read-cms-file", { name });

    if (response.status === 200) {
      setIsLoading(false);
      setSelectedCms(response.data);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <BasicLoader />
      </div>
    );
  } else if (!selectedCms) {
    return (
      <div className={styles.container}>
        <h1>CMS</h1>
        <div className={styles.grid}>
          {cms.map((el) => (
            <>
              <Button label={el.name} onClick={() => readCms(el.name)} />
              <div>{el.version.split("+")[0]}</div>
            </>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <h1>CMS</h1>
        <TextArea text={JSON.stringify(selectedCms, null, 2)} />
        <Button label="Back" onClick={() => setSelectedCms(null)} />
      </div>
    );
  }
}

export async function getServerSideProps() {
  const cms = await CMSRequester.getCMS();

  return {
    props: {
      cms: cms.slice(0, 12),
    },
  };
}
