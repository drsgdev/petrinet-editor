import { DragTypes } from "./DragTypes";

export default interface DragItem {
  id: string;
  type: DragTypes;
  tokens?: number;
  name?: string;
}
