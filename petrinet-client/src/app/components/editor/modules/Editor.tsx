import update from "immutability-helper";
import React, { ReactElement, useCallback, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDrop, XYCoord } from "react-dnd";
import "../styles/Editor.scss";
import DragItem from "../types/DragItem";
import { DragTypes } from "../types/DragTypes";
import Instrument from "./Instrument";
import Toolbar from "./Toolbar";

export default function Editor() {
  const [elements, setElements] = useState<{ id?: ReactElement }>({});
  const elementsCount = Object.keys(elements).length;

  const createElement = useCallback(
    (item: DragItem, left?: any, top?: any) => {
      const id = `${item.type}-${elementsCount}`;
      const elem = (
        <Instrument
          id={id}
          type={item.type}
          style={{ top: top, left: left, position: "fixed" }}
        />
      );
      setElements(
        update(elements, {
          [id]: { $set: elem },
        })
      );
    },
    [elements, elementsCount]
  );

  const moveItem = useCallback(
    (item: DragItem, left?: any, top?: any) => {
      const elem = (
        <Instrument
          id={item.id}
          type={item.type}
          style={{ top: top, left: left, position: "fixed" }}
        />
      );
      setElements(
        update(elements, {
          [item.id]: { $set: elem },
        })
      );
    },
    [elements, setElements]
  );

  const [, drop] = useDrop(
    () => ({
      accept: [DragTypes.PLACE, DragTypes.TRANSITION],
      drop(item: DragItem, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
        const initial = monitor.getInitialClientOffset() as XYCoord;
        const left = Math.round(initial.x + delta.x);
        const top = Math.round(initial.y + delta.y);

        if (Object.values(DragTypes).includes(item.id as DragTypes)) {
          createElement(item, left, top);
        } else {
          moveItem(item, left, top);
        }
        return undefined;
      },
    }),
    [createElement]
  );
  return (
    <Container fluid>
      <Row className="pr-3 pl-3">
        <Col xs={1} className="d-flex flex-column align-items-center toolbar-wrapper">
          <Toolbar />
        </Col>
        <Col className="editor-wrapper">
          <div id="editor" className="editor" ref={drop}>
            {elements ? Object.values(elements as any) : null}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
