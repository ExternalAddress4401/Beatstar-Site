import styles from "./cool_encrypt.module.scss";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { getRandomBetween } from "../utils/getRandomBetween";
import { useState } from "react";
import FileUploadButton from "../components/FileUploadButton";
import DifficultyPill from "../components/DifficultyPill";
import ImageSelector from "../components/ImageSelector";
import CoolInput from "../components/CoolInput";

interface UploadProps {
  name: string;
  data: any;
}

type Difficulty = "extreme" | "hard" | "normal";

export default function Encrypt() {
  const [chart, setChart] = useState<UploadProps | null>(null);
  const [id, setId] = useState(getRandomBetween(2000, 10000));
  const [pillType, setPillType] = useState<Difficulty>("extreme");

  const [artwork, setArtwork] = useState(null);

  const openFileDialog = (type: "chart" | "audio" | "artwork") => {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = function (event) {
      const file = input.files[0];
      if (file.type !== "image/png") {
        return;
      }
      switch (type) {
        case "artwork":
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            setArtwork(reader.result);
          });
          reader.readAsDataURL(file);
          break;
      }
    };
    input.click();
  };

  const onChangeType = () => {
    switch (pillType) {
      case "extreme":
        setPillType("hard");
        break;
      case "hard":
        setPillType("normal");
        break;
      case "normal":
        setPillType("extreme");
        break;
    }
  };

  return (
    <div className={styles.content}>
      <div>
        <div className={styles.group}>
          <CoolInput type="big" name="title" left={140} top={-340} />
          <CoolInput type="small" name="artist" left={140} top={-300} />
          <DifficultyPill
            left={241}
            top={-236}
            type={pillType}
            onChangeType={onChangeType}
          />
          <ImageSelector
            left={148}
            top={-232}
            image={artwork}
            onClick={() => openFileDialog("artwork")}
          />
          {/*<Select label="Difficulty" />*/}
        </div>

        {/*<div className={styles.group}>
          <FileUploadButton label="Chart" onUpload={() => null} />
          <Button label="Audio" />
          <Button label="Artwork" />
  </div>*/}
      </div>
      <div>
        <img src="images/game.png" />
      </div>
    </div>
  );
}
