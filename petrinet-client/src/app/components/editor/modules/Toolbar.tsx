import React from "react";
import "../styles/Toolbar.scss";
import { DragTypes } from "../types/DragTypes";
import Instrument from "./Instrument";

export default function Toolbar(props: any) {
  const Divider = <div className="mt-3"></div>;
  return (
    <div className="toolbox">
      <Instrument id={DragTypes.PLACE} type={DragTypes.PLACE} />
      {Divider}
      <Instrument id={DragTypes.TRANSITION} type={DragTypes.TRANSITION} />
    </div>
  );
}
