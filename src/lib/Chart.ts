import { BPM } from "../interfaces/BPM";
import { Direction } from "../interfaces/Direction";
import { Note } from "../interfaces/Note";
import { Size } from "../interfaces/Size";

export class Chart {
  resolution: number = 0;
  notes: Note[] = [];
  bpms: BPM[] = [];
  sections: number[] = [];
  perfectSizes: Size[] = [];
  speeds: Size[] = [];
  errors: string[] = [];
  effects: Record<number, number[]> = {};

  constructor() {}
  setResolution(resolution: number) {
    this.resolution = resolution;
  }
  setNotes(notes: Note[]) {
    this.notes = notes;
  }
  setBpms(bpms: BPM[]) {
    this.bpms = bpms;
  }
  setSections(sections: number[]) {
    this.sections = sections;
  }
  setPerfectSizes(perfectSizes: Size[]) {
    this.perfectSizes = perfectSizes;
  }
  setSpeeds(speeds: Size[]) {
    this.speeds = speeds;
  }
  setEffects(effects: Record<number, number[]>) {
    this.effects = effects;
  }
  applySizes(offset: number, size: number) {
    const notes = this.getNotes(offset);
    this.setNotes(notes.map((note) => ({ ...note, size })));
  }
  applySwipe(offset: number, lane: number, direction: Direction) {
    const note = this.getNote(offset, lane);
    if (!note) {
      this.errors.push(
        `Found event (${direction}${lane}) at ${offset} but there was no note there.`
      );
      return;
    }
    note.swipe = direction;
  }
  applySwitch(offset: number, startLane: number, endLane: number) {
    console.log(this.notes);
    const note = this.getLongNote(offset, startLane);
    console.log(offset, note);
    if (!note) {
      this.errors.push(
        `Found rail event at ${offset} but there was no target note.`
      );
      return;
    }
    if (!note.switches) {
      note.switches = [];
    }
    note.switches.push({
      offset,
      lane: endLane,
    });
  }
  getNote(offset: number, lane?: number) {
    for (const note of this.notes) {
      if (note.offset === offset) {
        if (lane && note.lane === lane) {
          return note;
        } else {
          return note;
        }
      }
      if (note.offset > offset) {
        return null;
      }
    }
    return null;
  }
  getNotes(offset: number) {
    const notes = [];
    for (const note of this.notes) {
      if (note.offset === offset) {
        notes.push(note);
      }
      if (note.offset > offset) {
        return notes;
      }
    }
    return null;
  }
  getLongNote(offset: number, lane: number) {
    for (const note of this.notes) {
      if (
        note.lane === lane &&
        note.offset <= offset &&
        note.offset + note.length >= offset
      ) {
        return note;
      }
    }
    return null;
  }
}
