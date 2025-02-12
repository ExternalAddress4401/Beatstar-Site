import { BPM } from "../interfaces/BPM";
import { Chart } from "./Chart";

export function getMaxScore(chart: Chart, difficulty: number) {
  let score = 0;

  //hold swipes count as extra notes
  const noteLength =
    chart.notes.length +
    chart.notes.filter((note) => note.length && note.swipe).length;

  score += noteLength >= 10 ? 10 * 250 : noteLength * 250;

  if (noteLength > 25) {
    score += noteLength >= 25 ? (25 - 10) * 500 : (noteLength - 10) * 500;
  }

  switch (difficulty) {
    case 4:
      if (noteLength > 25) score += (noteLength - 25) * 750;
      break;
    case 3:
      if (noteLength > 25) {
        score += noteLength >= 50 ? (50 - 25) * 750 : (noteLength - 25) * 750;
      }
      if (noteLength > 50) {
        score += (noteLength - 50) * 1000;
      }
      break;
    case 1:
      if (noteLength > 25) {
        score += noteLength >= 50 ? (50 - 25) * 750 : (noteLength - 25) * 750;
      }
      if (noteLength > 50) {
        score +=
          noteLength > 100 ? (100 - 50) * 1000 : (noteLength - 50) * 1000;
      }
      if (noteLength > 100) {
        score += (noteLength - 100) * 1250;
      }
      break;
  }

  const holdTickCount = chart.notes.reduce(function (prev, note) {
    const isHoldSwipe = note.length && note.swipe;
    if (isHoldSwipe && (note.offset % 192) + note.length >= chart.resolution) {
      prev--;
    } else if (
      note.switches &&
      (note.offset % 192) + note.length >= chart.resolution
    ) {
      prev--;
    }

    return (
      prev +
      (note.length === 0
        ? 0
        : Math.floor(
            Math.floor((note.offset + note.length) / chart.resolution) -
              Math.floor(note.offset / chart.resolution)
          ))
    );
  }, 0);

  score += holdTickCount * (250 * 0.2);

  return score;
}

export function adjustBpms(chart: Chart) {
  const notes = chart.notes;
  let sections = chart.sections;
  let effects = chart.effects;
  let perfects = chart.perfectSizes;
  let speeds = chart.speeds;

  const bpms = chart.bpms;

  const resolution = chart.resolution;

  let startingBpm = bpms[0];
  let sectionAdjustment = 0;

  const adjustedEffects = {};

  //first we adjust each note by the BPM change
  for (var x = 1; x < bpms.length; x++) {
    let currentBpm = bpms[x];
    let nextBpm: BPM;
    if (bpms[x + 1]) {
      nextBpm = bpms[x + 1];
    } else {
      nextBpm = bpms.at(x - 1);
      nextBpm.offset = notes[notes.length - 1].offset;
    }

    let bpmMultiplier = currentBpm.change / startingBpm.change;
    let part = (nextBpm.offset - currentBpm.offset) / resolution;
    let change = currentBpm.change / startingBpm.change;

    //get the notes between
    let relevantNotes = notes.filter(
      (el) => el.offset > currentBpm.offset && el.offset <= nextBpm.offset
    );
    let relevantSections = sections.filter(
      (el) => el.offset > currentBpm.offset && el.offset <= nextBpm.offset
    );
    let relevantEffects = effects.filter(
      (effect) =>
        effect.offset > currentBpm.offset && effect.offset <= nextBpm.offset
    );
    let relevantPerfects = perfects.filter(
      (el) => el.offset > currentBpm.offset && el.offset <= nextBpm.offset
    );
    let relevantSpeeds = speeds.filter(
      (el) => el.offset > currentBpm.offset && el.offset <= nextBpm.offset
    );
    for (var y = 0; y < relevantNotes.length; y++) {
      let note = relevantNotes[y];
      let adjustingValue =
        (note.offset - currentBpm.offset) / resolution / bpmMultiplier;

      note.adjustedStart =
        currentBpm.offset -
        sectionAdjustment * resolution +
        adjustingValue * resolution;

      if (note.length) {
        const endOffset = note.offset + note.length;
        let endAdjustingValue =
          (endOffset - currentBpm.offset) / resolution / bpmMultiplier;

        note.adjustedEnd =
          currentBpm.offset -
          sectionAdjustment * resolution +
          endAdjustingValue * resolution;

        note.length = note.adjustedEnd - note.adjustedStart;
      }

      if (note.switches) {
        note.switches = note.switches.map((el) => ({
          ...el,
          offset:
            currentBpm.offset -
            sectionAdjustment * resolution +
            ((el.offset - currentBpm.offset) / resolution / bpmMultiplier) *
              resolution,
        }));
      }
    }
    for (const section of relevantSections) {
      let adjustingValue =
        (section.offset - currentBpm.offset) / resolution / bpmMultiplier;

      section.adjustedOffset =
        currentBpm.offset -
        sectionAdjustment * resolution +
        adjustingValue * resolution;
    }
    for (const effect of relevantEffects) {
      let adjustingValue =
        (effect.offset - currentBpm.offset) / resolution / bpmMultiplier;

      effect.adjustedOffset =
        currentBpm.offset -
        sectionAdjustment * resolution +
        adjustingValue * resolution;
    }
    for (const perfect of relevantPerfects) {
      let adjustingValue =
        (perfect.offset - currentBpm.offset) / resolution / bpmMultiplier;

      perfect.adjustedOffset =
        currentBpm.offset -
        sectionAdjustment * resolution +
        adjustingValue * resolution;
    }
    for (const speed of relevantSpeeds) {
      let adjustingValue =
        (speed.offset - currentBpm.offset) / resolution / bpmMultiplier;

      speed.adjustedOffset =
        currentBpm.offset -
        sectionAdjustment * resolution +
        adjustingValue * resolution;
    }
    sectionAdjustment += part - part / change;
  }

  for (const note of notes) {
    note.offset = note.adjustedStart ? note.adjustedStart : note.offset;
  }
  for (const section of sections) {
    section.offset = section.adjustedOffset;
  }
  for (const perfect of perfects) {
    perfect.offset = perfect.adjustedOffset;
  }
  for (const speed of speeds) {
    speed.offset = speed.adjustedOffset;
  }
  for (const effect of effects) {
    effect.offset = effect.adjustedOffset;
  }
}
