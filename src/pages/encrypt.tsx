import styles from "./encrypt.module.scss";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { getRandomBetween } from "../utils/getRandomBetween";
import React, { useState } from "react";
import { Chart, readChart } from "../lib/ChartReader";
import { readFile } from "../utils/readFile";
import { isPng } from "../utils/isPng";
import Footer from "../components/Footer";
import UploadProps from "../interfaces/UploadProps";
import { buildChart } from "../lib/ChartBuilder";
import { ProtobufWriter, ChartProto } from "@externaladdress4401/protobuf";
import { getMaxScore } from "../lib/ChartUtils";

interface SongInfo {
  title: string;
  artist: string;
  id: number;
  difficulty: number;
}

interface BuiltSongInfo extends SongInfo {
  bpm: number;
  sections: number;
  maxScore: number;
  numLanes: number;
}

export default function Encrypt() {
  const [chart, setChart] = useState<UploadProps | null>({
    icon: "circle-question",
  });
  const [audio, setAudio] = useState<UploadProps | null>({
    icon: "circle-question",
  });
  const [artwork, setArtwork] = useState<UploadProps>({
    icon: "circle-question",
  });
  const [info, setInfo] = useState<SongInfo>({
    title: "",
    artist: "",
    id: getRandomBetween(2000, 10000),
    difficulty: 1,
  });
  const [errors, setErrors] = useState<string[] | null>(null);

  const onInfoChange = (e: React.FormEvent<HTMLInputElement>) => {
    switch (e.currentTarget.name) {
      case "title":
        setInfo({
          ...info,
          title: e.currentTarget.value,
        });
        break;
      case "artist":
        setInfo({
          ...info,
          artist: e.currentTarget.value,
        });
        break;
      case "id":
        setInfo({
          ...info,
          id: parseInt(e.currentTarget.value),
        });
        break;
      case "difficulty":
        setInfo({
          ...info,
          difficulty: parseInt(e.currentTarget.value),
        });
        break;
    }
  };

  const openFileDialog = (
    type: "chart" | "audio" | "artwork",
    filter: string
  ) => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = filter;
    input.onchange = async function () {
      const file = input.files[0];
      switch (type) {
        case "chart":
          const chartData = await readFile(file, "text");
          const parsedChart = readChart(chartData.toString());
          if (parsedChart.errors.length) {
            setErrors(parsedChart.errors);
            return;
          }
          setChart({
            name: file.name,
            data: readChart(chartData.toString()),
            icon: "check",
          });
          break;
        case "audio":
          const audioData = (await readFile(
            file,
            "arraybuffer"
          )) as ArrayBuffer;
          setAudio({
            name: file.name,
            data: audioData,
            icon: "check",
          });
          break;
        case "artwork":
          const artworkData = (await readFile(
            file,
            "arraybuffer"
          )) as ArrayBuffer;
          if (!isPng(new Uint8Array(artworkData))) {
            setErrors(["This isn't a PNG. Please supply a valid PNG file."]);
            setArtwork({
              icon: "x",
            });
            return;
          }
          setArtwork({
            name: file.name,
            data: artworkData,
            icon: "check",
          });
          break;
      }
    };
    input.click();
  };

  const onSubmit = () => {
    const finalChart = chart.data as Chart;
    const response = buildChart(finalChart);

    const finalInfo: BuiltSongInfo = {
      title: info.title,
      artist: info.artist,
      id: info.id,
      difficulty: info.difficulty,
      bpm: finalChart.syncTrack.find((el) => "change" in el).change,
      sections: finalChart.sections.length,
      maxScore: getMaxScore(finalChart, info.difficulty),
      //numLanes
    };

    const writer = new ProtobufWriter(response);
    writer.build(ChartProto);
    console.log(writer);
  };

  return (
    <div className={styles.content}>
      <div className={styles.group}>
        <Input label="Title" type="text" onChange={onInfoChange} />
        <Input label="Artist" type="text" onChange={onInfoChange} />
        <Input
          label="ID"
          type="number"
          value={info.id}
          onChange={onInfoChange}
        />
        <Select label="Difficulty" />
      </div>

      <div className={styles.group}>
        <Button
          label={chart.name ? chart.name : "Chart"}
          startIcon="upload"
          endIcon={chart.icon}
          onClick={() => openFileDialog("chart", ".chart")}
        />
        <Button
          label={audio.name ? audio.name : "Audio"}
          startIcon="upload"
          endIcon={audio.icon}
          onClick={() => openFileDialog("audio", ".wem")}
        />
        <Button
          label={artwork.name ? artwork.name : "Artwork"}
          startIcon="upload"
          endIcon={artwork.icon}
          onClick={() => openFileDialog("artwork", ".png")}
        />

        <Button label="Create" onClick={onSubmit} />
      </div>
      <Footer errors={errors} />
    </div>
  );
}
