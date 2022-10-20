import { useEffect, useState, createRef, useRef } from "react";
import anime from "animejs";
import cn from "classnames";

import styles from "./test.module.scss";

const Tile = () => {
  return <div className={styles.tile}></div>;
};

export default function Test() {
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const gridRef = createRef<HTMLDivElement>();
  const showIntroRef = useRef(true);

  useEffect(() => {
    //do the intro transition
    const size = document.body.clientWidth > 800 ? 100 : 50;
    const columns = Math.floor(document.body.clientHeight / size);
    const rows = Math.floor(document.body.clientWidth / size);

    if (gridRef.current.children.length && showIntroRef.current) {
      showIntroRef.current = false;
      const animation = anime({
        targets: gridRef.current.children,
        backgroundColor: "rgb(255, 0, 255)",
        delay: anime.stagger(25, {
          grid: [rows, columns],
          from: (columns * rows) / 2,
        }),
      });

      animation.finished.then(function () {
        anime({
          targets: gridRef.current.children,
          backgroundColor: "rgb(20, 20, 20)",
          delay: anime.stagger(25, {
            grid: [rows, columns],
            from: (columns * rows) / 2,
          }),
        });
      });
    }

    const handleResize = () => {
      const size = document.body.clientWidth > 800 ? 100 : 50;
      setRows(Math.floor(document.body.clientHeight / size));
      setColumns(Math.floor(document.body.clientWidth / size));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
  }, [gridRef]);

  return (
    <div>
      <div
        style={{
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
        className={styles.tiles}
        ref={gridRef}
      >
        {Array.from(Array(columns * rows)).map((tile, index) => (
          <Tile key={index} />
        ))}
      </div>
      <h1 className={cn(styles.title, styles.centered)}>BEATSTAR</h1>
    </div>
  );
}
