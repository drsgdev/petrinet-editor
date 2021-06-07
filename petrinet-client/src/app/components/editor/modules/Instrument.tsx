import React, { CSSProperties, useState } from "react";
import { useDrag } from "react-dnd";
import "../styles/Toolbar.scss";
import { DragTypes } from "../types/DragTypes";

interface InstrumentProps {
  id: string;
  type: DragTypes;
  style?: CSSProperties;
}

export default function Instrument(props: InstrumentProps) {
  const { id, type, style } = props;
  const [className, setClassName] = useState<string>("");

  const [{ isDragging }, drag] = useDrag({
    type,
    item: { id, type },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  if (className === "") {
    setClassName(
      id.split("-")[0] + " d-flex flex-column justify-content-center"
    );
  }

  // makes short labels when item is placed inside the editor div
  const splittedId = id.split("-");
  const label =
    splittedId.length !== 1
      ? `${splittedId[0][0].toUpperCase()}-${splittedId[1]}`
      : id;

  return (
    <div
      className={className + (isDragging ? " dragging" : "")}
      ref={drag}
      id={id}
      style={style}
    >
      <label className="pt-1" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
