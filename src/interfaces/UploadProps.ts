import { Chart } from "../lib/Chart";

export default interface UploadProps {
  name?: string;
  data?: Chart | ArrayBuffer;
  file?: any;
  icon: "circle-question" | "x" | "check" | "none";
}
