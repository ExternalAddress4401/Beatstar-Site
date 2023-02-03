import styles from "./encrypt.module.scss";
import { useState } from "react";
import BasicLoader from "../components/BasicLoader";
import Tabs from "../components/Tabs";
import FullChartPage from "../components/FullChartPage";
import SingleFilePage from "../components/SingleFilePage";

export default function Encrypt() {
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("Full");

  if (loading) {
    return (
      <div className={styles.loader}>
        <BasicLoader />
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <Tabs
        options={["Full", "Single"]}
        selected={selected}
        onSelect={(value) => setSelected(value)}
      />
      {selected === "Full" ? (
        <FullChartPage onLoad={(value) => setLoading(value)} />
      ) : (
        <SingleFilePage onLoad={(value) => setLoading(value)} />
      )}
    </div>
  );
}
