import styles from "./create.module.scss";
import { useEffect, useState } from "react";

const steps = [
  1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768,
];

interface NoteProps {
  top: number;
  color: string;
}

interface LineProps {
  top: number;
  color: string;
}

const Note = ({ top, color }: NoteProps) => {
  return (
    <div
      style={{ top: top + "px", backgroundColor: color }}
      className={styles.note}
    >
      <div className={styles.line} />
    </div>
  );
};

interface PanelProps {
  step: number;
  currentPos: number;
}

const Panel = ({ step, currentPos }: PanelProps) => {
  return (
    <div className={styles.panel}>
      <div>{step}</div>
      <div>{currentPos}</div>
    </div>
  );
};

const Line = ({ top, color }: LineProps) => {
  return (
    <div
      style={{ top: top + "px", backgroundColor: color }}
      className={styles.beatline}
    ></div>
  );
};

export default function Create() {
  const [stepIndex, setStepIndex] = useState(0);
  const [currentPos, setCurrentPos] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [beatLines, setBeatLines] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    setWindowHeight(window.innerHeight);

    const change = 768 / steps[stepIndex];

    const beatlineCount = Math.floor(window.innerHeight / change);
    const beatlines = new Array(beatlineCount).fill(0).map((el, index) => ({
      y: windowHeight - 100 - index * (768 / steps[stepIndex]),
      color: "white",
    }));
    setBeatLines(beatlines);
  }, [stepIndex, currentPos]);

  const onKeyDown = (e) => {
    let change = 768 / steps[stepIndex];
    switch (e.key) {
      case "[":
        if (stepIndex > 0) {
          setStepIndex(stepIndex - 1);
        }
        break;
      case "]":
        if (stepIndex < steps.length - 1) {
          setStepIndex(stepIndex + 1);
        }
        break;
      case "ArrowUp":
        setCurrentPos(currentPos + change);
        break;
      case "ArrowDown":
        if (currentPos - change < 0) {
          setCurrentPos(0);
        } else {
          setCurrentPos(currentPos - change);
        }
        break;
    }
  };

  const onMouseMove = (e) => {
    const x = e.pageX;
    const y = e.pageY;

    setNotes(
      notes.map((note) => ({
        ...note,
        color: y > note.offset - 15 && y < note.offset + 15 ? "red" : "black",
      }))
    );
    setBeatLines(
      beatLines.map((el) => ({
        ...el,
        color: y > el.y - 15 && y < el.y + 15 ? "red" : "gray",
      }))
    );
  };

  const onClick = (e) => {
    const x = e.pageX;
    const y = e.pageY;

    const line = beatLines.find((el) => y > el.y - 15 && y < el.y + 15);

    const laneSize = window.innerWidth / 5;

    if (line) {
      setNotes(
        notes.concat({
          lane: Math.floor(x / laneSize),
          offset: line.y - 47.5,
        })
      );
    }
  };
  return (
    <div
      className={styles.screen}
      onKeyDown={onKeyDown}
      onMouseMove={onMouseMove}
      onClick={onClick}
      tabIndex={-1}
    >
      <div className={styles.lanes}>
        <div className={styles.lane}>
          {notes.map(
            (el) => el.lane === 1 && <Note top={el.offset} color={el.color} />
          )}
        </div>
        <div className={styles.lane}>
          {notes.map(
            (el) => el.lane === 2 && <Note top={el.offset} color={el.color} />
          )}
        </div>
        <div className={styles.lane}>
          {notes.map(
            (el) => el.lane === 3 && <Note top={el.offset} color={el.color} />
          )}
        </div>
      </div>
      <Panel step={steps[stepIndex]} currentPos={currentPos} />
      {beatLines.map((el) => (
        <Line top={el.y} color={el.color} />
      ))}
    </div>
  );
}
