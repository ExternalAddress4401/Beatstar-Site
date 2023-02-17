import styles from "./cms.module.scss";
import { CMSRequester } from "@externaladdress4401/protobuf";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { CMSFileName } from "../utils/readCmsFile";
import TextArea from "../components/TextArea";
import BasicLoader from "../components/BasicLoader";
import Tabs from "../components/Tabs";

interface CMSProps {
  cms: {
    name: CMSFileName;
    version: string;
    hash: string;
    url: string;
  }[];
}

export default function Cms() {
  const [fetchedCms, setFetchedCms] = useState(null);
  const [selectedCms, setSelectedCms] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [game, setGame] = useState("Beatstar");

  useEffect(() => {
    async function get() {
      const response = await axios.post("/api/get-cms-links", { game });

      setFetchedCms(response.data.cms);
    }

    get();
  }, [game]);

  const readCms = async (name: CMSFileName) => {
    setIsLoading(true);
    const response = await axios.post("/api/read-cms-file", { name, game });

    if (response.status === 200) {
      setIsLoading(false);
      setSelectedCms(response.data);
    }
  };

  const onTabChange = (value: string) => {
    setFetchedCms(null);
    setGame(value);
  };

  if (isLoading || !fetchedCms) {
    return (
      <div className={styles.container}>
        <BasicLoader />
      </div>
    );
  } else if (!selectedCms) {
    return (
      <div className={styles.container}>
        <h1>CMS</h1>
        <Tabs
          options={["Beatstar", "Countrystar"]}
          selected={game}
          onSelect={onTabChange}
        />
        <div className={styles.grid}>
          {fetchedCms.map((el) => (
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
