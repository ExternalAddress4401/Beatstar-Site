import { Chart } from "../lib/ChartReader";

export default interface UploadProps {
  name?: string;
  data?: Chart | ArrayBuffer;
  icon: "circle-question" | "x" | "check" | "none";
}
