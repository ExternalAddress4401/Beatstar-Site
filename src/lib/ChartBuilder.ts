import { Chart, Size } from "./ChartReader";

interface BuiltChart {
  id: number;
  interactions_id: string;
  notes: BytesNote[];
  sections: BuiltSection[];
  perfectSizes: Size[];
  speeds: Size[];
}

interface BuiltSection {
  offset: number;
}

interface BytesNote {
  note_type: number;
  single?: {
    note: {
      offset: number;
      lane: number;
    };
  };
  long?: {
    note: {
      offset: number;
      lane: number;
    }[];
  };
  lane: number;
}

export function buildChart(chart: Chart) {
  const resolution = chart.info.resolution;

  const finalChart: BuiltChart = {
    id: 508,
    interactions_id: "77-1",
    notes: [],
    sections: chart.sections.map((section) => {
      return { offset: section / resolution };
    }),
    perfectSizes: chart.perfectSizes.map((perfectSize) => {
      return {
        ...perfectSize,
        offset: perfectSize.offset / resolution,
      };
    }),
    speeds: chart.speeds.map((speed) => {
      return {
        ...speed,
        offset: speed.offset / resolution,
      };
    }),
  };

  for (const note of chart.notes) {
    const noteType = note.length === 0 ? 1 : 2;
    if (noteType === 1) {
      finalChart.notes.push({
        note_type: 1,
        single: {
          note: {
            offset: note.offset / resolution,
            lane: note.lane,
          },
        },
        lane: note.lane,
      });
    } else if (noteType === 2) {
      finalChart.notes.push({
        note_type: 2,
        long: {
          note: [
            {
              offset: note.offset,
              lane: note.lane,
            },
            {
              offset: note.offset + note.length,
              lane: note.lane,
            },
          ],
        },
        lane: note.lane,
      });
    }
  }

  if (!finalChart.perfectSizes.length) {
    finalChart.perfectSizes.push({
      offset: 0,
      multiplier: 1,
    });
  }
  if (!finalChart.speeds.length) {
    finalChart.speeds.push({
      offset: 0,
      multiplier: 1,
    });
  }

  return finalChart;
}
