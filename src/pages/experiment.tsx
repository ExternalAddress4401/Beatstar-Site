import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { readChart } from "../lib/ChartReader";
import { promises as fs } from "fs";
import { OrbitControls } from "@react-three/drei";
import { Arrow } from "../models/Arrow";

interface NoteProps {
  x: number;
  z: number;
  length: number;
  swipe: "u" | "d" | "l" | "r";
  size: number;
  pushAhead: boolean;
}

function Note(props: NoteProps) {
  let width = 8,
    length = props.size;

  if (props.length) {
    length += props.length / 6;
  }

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, length);
  shape.lineTo(width, length);
  shape.lineTo(width, 0);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    steps: 6,
    depth: 1,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: 2,
    bevelOffset: 0,
    bevelSegments: 1,
  };

  let x = props.x - 3;
  let z = props.z;
  const ref = useRef();

  //center point when the size is normal
  let center = width / 2 - 9 + z;

  if (props.size != 12 && props.pushAhead) {
    z += 12 - props.size;
  }

  //accounts for the different on long swipes
  if (props.swipe) {
    center -= 2;
    width -= 2;
  }

  const showBar = (props.length != 0 && props.swipe !== null) || !props.swipe;

  //the largest a note should be is half of the note after it

  return (
    <>
      <mesh
        {...props}
        rotation={[-Math.PI / 2, 0, Math.PI]}
        ref={ref}
        position={[x + 8, 0, z - 12]}
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshPhongMaterial color="rgb(40, 40, 40)" />
      </mesh>
      {props.length && (
        <mesh
          {...props}
          rotation={[-Math.PI / 2, 0, 0]}
          ref={ref}
          position={[x + 4, 3, center]}
        >
          <boxGeometry args={[2.36, width - 9, 1]} />
          <meshStandardMaterial color="rgb(255, 255, 255)" />
        </mesh>
      )}
      {showBar && (
        <mesh
          {...props}
          rotation={[-Math.PI / 2, 0, 0]}
          ref={ref}
          position={[x + 4, 3, z - 5]}
        >
          <boxGeometry args={[5, 1, 1]} />
          <meshStandardMaterial color="rgb(255, 255, 255)" />
        </mesh>
      )}
      {props.swipe && (
        <Arrow
          x={x + 4.05}
          y={3.41}
          z={z - 6}
          color="rgb(255, 255, 255)"
          offset={props.length ? width : null}
          swipe={props.swipe}
        />
      )}
    </>
  );
}

const Game = (props) => {
  const [mult, setMult] = useState(0);
  useFrame(() => {
    if (props.playing) {
      setMult(mult + 0.5);
    }
  });
  return (
    <>
      {props.chart.notes.map((note, index) => {
        switch (note.lane) {
          case 0:
            return (
              <Note
                x={15}
                z={(note.offset / 192) * 32 - mult}
                length={note.length}
                swipe={note.swipe}
                size={note.size}
                pushAhead={note.pushAhead}
              />
            );
          case 1:
            return (
              <Note
                x={0}
                z={(note.offset / 192) * 32 - mult}
                length={note.length}
                swipe={note.swipe}
                size={note.size}
                pushAhead={note.pushAhead}
              />
            );
          case 2:
            return (
              <Note
                x={-15}
                z={(note.offset / 192) * 32 - mult}
                length={note.length}
                swipe={note.swipe}
                size={note.size}
                pushAhead={note.pushAhead}
              />
            );
        }
      })}
    </>
  );
};

export default function App(props) {
  const [playing, setPlaying] = useState(false);
  console.log(playing);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "KeyF") {
        setPlaying(!playing);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [playing]);

  const onKeyDown = (e) => {
    console.log(e.keyCode);
  };

  return (
    <Canvas camera={{ fov: 75, position: [0, 100, -40] }} onKeyDown={onKeyDown}>
      <pointLight position={[0, 30, 0]} color="white" />
      <Game chart={props.chart} playing={playing} />
      <OrbitControls />
    </Canvas>
  );
}

export async function getServerSideProps(context) {
  const chart = (await fs.readFile("./s.chart")).toString();
  const c = readChart(chart, false);

  for (var i = 0; i < c.notes.length - 1; i++) {
    const note = c.notes[i];
    if (note.offset == 1152) {
      console.log(note);
    }
    if (note.size === 1) {
      note.size = c.notes[i - 1].size;
      //note.pushAhead = true;
      continue;
    } else if (note.size === 2) {
      //???
    } else if (note.size) {
      continue;
    }
    const next = c.notes[i + 1];
    const nextInLane = c.notes.find(
      (el) => el.lane === note.lane && el.offset > note.offset
    );
    if (next.offset - note.offset < 48) {
      //we need to make the first note smaller now
      note.size = (next.offset - note.offset) / 2.5;
    } else if (nextInLane?.offset - note.offset === 96) {
      note.size = 6;
      nextInLane.size = 6;
      //note.pushAhead = true;
    } else {
      note.size = 12;
    }
  }

  c.notes[c.notes.length - 1].size = 12;

  console.log(c);

  return {
    props: {
      chart: c,
    },
  };
}
