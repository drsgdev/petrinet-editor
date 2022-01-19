import { PetriNet } from "@pseuco/colored-petri-nets";
import {
  Marking,
  PetriNetObject,
  PlaceObject,
  TransitionObject,
} from "@pseuco/colored-petri-nets/dist/coloredPetriNets";
import update from "immutability-helper";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDrop, XYCoord } from "react-dnd";
import Xarrow from "react-xarrows/lib";
import "../styles/Editor.scss";
import DragItem from "../types/DragItem";
import { DragTypes } from "../types/DragTypes";
import Instrument, { InstrumentProps } from "./Instrument";
import Toolbar from "./Toolbar";

interface InFlow {
  source: string;
  pattern: string;
}

interface OutFlow {
  target: string;
  expression: string;
}

interface Arc {
  start: string;
  end?: string;
}

interface SimpleMarking {
  [id: string]: number;
}

interface Element {
  [id: string]: InstrumentProps;
}

export interface EditorProps {
  data?: any;
}

export default function Editor(props: EditorProps) {
  const { data } = props;
  const [elements, setElements] = useState<{
    [DragTypes.PLACE]: Element;
    [DragTypes.TRANSITION]: Element;
  }>({
    [DragTypes.PLACE]: {},
    [DragTypes.TRANSITION]: {},
  });
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [arcElements, setArcElements] = useState<JSX.Element[]>([]);
  const [marking, setMarking] = useState<SimpleMarking>({});
  const [net, setNet] = useState<Marking | null>();

  const [connectionMode, setConnectionMode] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);

  const renderArcs = useCallback(() => {
    const toRender: JSX.Element[] = [];
    arcs.forEach((arc) => {
      if (arc.start && arc.end) {
        toRender.push(
          <Xarrow
            key={`${arc.start}-to-${arc.end}`}
            start={arc.start}
            end={arc.end}
            curveness={0.5}
            strokeWidth={2}
            passProps={{
              className: "arc",
              onClick: () => {
                setArcs(
                  arcs.filter(
                    (other) =>
                      other.start &&
                      other.end &&
                      !(other.start === arc.start && other.end === arc.end)
                  )
                );
                renderArcs();
              },
            }}
          ></Xarrow>
        );
      }
    });

    setArcElements(toRender);
  }, [arcs]);

  useEffect(() => {
    if (!arcs) return;

    if (arcs.length === 0) {
      renderArcs();
      return;
    }
    // unwanted re-render for incomplete arcs protection
    if (!arcs[arcs.length - 1]?.end) return;

    renderArcs();
  }, [arcs, renderArcs]);

  const connect = useCallback(
    (event: any) => {
      if (!connectionMode) return;

      const id = event.target.id;
      const index = arcs.findIndex(
        (arc) => !!arc.start && arc.start !== id && !arc.end
      );

      let arc = arcs[index];
      if (!arc) {
        arc = {
          start: id,
        };
        setArcs(update(arcs, { $push: [arc] }));
        return;
      }

      const startId = arc.start?.split("-")[0];
      const endId = event.target.id.split("-")[0];
      if (startId === endId) {
        setArcs(update(arcs, { $splice: [[index]] }));
        return;
      }

      arc.end = id;
      setArcs(
        update(arcs, {
          [index]: { $set: arc },
        })
      );

      renderArcs();
    },
    [arcs, connectionMode, renderArcs]
  );

  const elementsCount = useMemo(
    () => ({
      [DragTypes.PLACE]: Object.keys(elements[DragTypes.PLACE]).length,
      [DragTypes.TRANSITION]: Object.keys(elements[DragTypes.TRANSITION])
        .length,
    }),
    [elements]
  );

  const createElement = useCallback(
    (item: DragItem, left?: any, top?: any) => {
      const id = `${item.type}-${elementsCount[item.type]++}`;
      const props = {
        id,
        type: item.type,
        style: { top: top, left: left, position: "fixed" },
      };
      setElements(
        update(elements, {
          [item.type]: { [id]: { $set: props } },
        })
      );
    },
    [elements, elementsCount]
  );

  const deleteElement = useCallback(
    (item: DragItem) => {
      setElements(
        update(elements, {
          [item.type]: {
            $unset: [item.id],
          },
        })
      );
    },
    [elements]
  );

  const moveElement = useCallback(
    (item: DragItem, left?: number, top?: number) => {
      const props = {
        id: item.id,
        type: item.type,
        style: { top: top, left: left, position: "fixed" },
        name: item.name,
      };
      setElements(
        update(elements, {
          [item.type]: { [item.id]: { $set: props } },
        })
      );

      renderArcs();
    },
    [elements, renderArcs]
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
          moveElement(item, left, top);
        }

        return undefined;
      },
    }),
    [createElement]
  );

  const setElementName = useCallback(
    (id: string, type: DragTypes, name: string) => {
      setElements(
        update(elements, {
          [type]: { [id]: { $merge: { name: name } } },
        })
      );
    },
    [elements]
  );

  const setTokens = useCallback(
    (id: string, tokens: number) => {
      setMarking(
        update(marking, {
          [id]: { $set: tokens },
        })
      );
      setNet(null);
    },
    [marking]
  );

  const parseNet = useCallback(() => {
    const net: PetriNetObject = {
      places: [],
      transitions: [],
      initialMarking: {
        tokens: {},
        extensions: {},
      },
      extensions: {},
    };

    for (const type in elements) {
      const group = elements[type as DragTypes];
      for (const id in group) {
        const element = group[id];
        if (element.type === DragTypes.PLACE) {
          const place: PlaceObject = {
            key: id,
            displayName: element.name ?? id,
            extensions: {},
          };
          net.places.push(place);

          const tokens = [];
          for (let token = 0; token < marking[id]; token++) {
            tokens.push({ color: "black" });
          }
          net.initialMarking.tokens[id] = tokens;
        } else {
          const inFlows: InFlow[] = [];
          const outFlows: OutFlow[] = [];

          arcs
            .filter((arc) => arc.end === id)
            .forEach((arc) => {
              inFlows.push({
                source: arc.start,
                pattern: "x",
              });
            });

          arcs
            .filter((arc) => arc.start === id)
            .forEach((arc) => {
              if (arc.end) {
                outFlows.push({
                  target: arc.end,
                  expression: "x",
                });
              }
            });

          const transition: TransitionObject = {
            key: id,
            displayName: element.name ?? id,
            extensions: {},
            guard: "true",
            inFlows,
            outFlows,
          };

          net.transitions.push(transition);
        }
      }
    }

    return net;
  }, [arcs, elements, marking]);

  useEffect(() => {
    const moves = net?.enabledMoves();
    updateMarking(net?.tokens);

    let transitions: Element = {};
    Object.values(elements[DragTypes.TRANSITION]).forEach((transition) => {
      const move = moves?.find((move) => move.transition.key === transition.id);
      let canFire: boolean;

      if (move) {
        canFire = true;
      } else {
        canFire = false;
      }

      transitions[transition.id] = {
        ...elements[DragTypes.TRANSITION][transition.id],
        enabled: canFire,
      };
    });

    setElements(
      update(elements, {
        [DragTypes.TRANSITION]: { $set: transitions },
      })
    );
  }, [net]);

  const updateMarking = useCallback((tokens) => {
    const newMarking: SimpleMarking = {};
    if (tokens) {
      Object.keys(tokens).forEach((placeId) => {
        newMarking[placeId] = tokens[placeId].length;
      });

      setMarking(newMarking);
    }
  }, []);

  const fire = useCallback(
    (id: string) => {
      const move = net
        ?.enabledMoves()
        .find((move) => move.transition.key === id);
      if (move) {
        setNet(move.marking);
      }
    },
    [net]
  );

  const run = useCallback(() => {
    if (running) {
      setRunning(false);

      return;
    }

    if (!net) {
      const parsedNet = PetriNet.fromObject(parseNet());
      setNet(parsedNet.initialMarking);
    }
    setRunning(true);
  }, [net, parseNet, running]);

  const reset = useCallback(() => {
    setNet(net?.net.initialMarking);
  }, [net]);

  const renderElements = useCallback(
    (type: DragTypes) => {
      const toRender: JSX.Element[] = [];
      Object.values(elements[type]).forEach((props) =>
        toRender.push(
          <Instrument
            key={props.id}
            onClick={connect}
            onDelete={deleteElement}
            tokens={marking[props.id]}
            setTokens={setTokens}
            setName={setElementName}
            connectionMode={connectionMode}
            enabled={props.enabled}
            fire={fire}
            running={running}
            {...props}
          />
        )
      );

      return toRender;
    },
    [
      connect,
      connectionMode,
      deleteElement,
      elements,
      fire,
      marking,
      running,
      setElementName,
      setTokens,
    ]
  );

  const handleExport = useCallback((jsonData) => {
    const fileData = JSON.stringify(jsonData);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `net.json`;
    link.href = url;
    link.click();
  }, []);

  const exportButton = useMemo(
    () => (
      <Button
        className={"mb-2"}
        onClick={() => {
          const json = {
            elements,
            arcs,
            marking,
          };
          handleExport(json);
        }}
        disabled={
          elementsCount[DragTypes.PLACE] === 0 ||
          elementsCount[DragTypes.TRANSITION] === 0
        }
      >
        Export
      </Button>
    ),
    [arcs, elements, elementsCount, handleExport, marking]
  );

  const connectButton = useMemo(
    () => (
      <Button
        className={"mb-2" + (connectionMode ? " btn-success" : "")}
        onClick={() => {
          setConnectionMode(!connectionMode);
        }}
        disabled={
          elementsCount[DragTypes.PLACE] === 0 ||
          elementsCount[DragTypes.TRANSITION] === 0
        }
      >
        Connect
      </Button>
    ),
    [connectionMode, elementsCount]
  );

  const resetButton = useMemo(
    () => (
      <Button
        className="mb-2"
        variant="danger"
        disabled={
          elementsCount[DragTypes.PLACE] === 0 &&
          elementsCount[DragTypes.TRANSITION] === 0
        }
        onClick={() => {
          setRunning(false);
          setConnectionMode(false);
          setElements({
            [DragTypes.PLACE]: {},
            [DragTypes.TRANSITION]: {},
          });
          setArcs([]);
          setArcElements([]);
          setMarking({});
        }}
      >
        Reset
      </Button>
    ),
    [elementsCount]
  );

  const startButton = useMemo(
    () => (
      <div className="d-flex flex-row justify-content-between">
        <Button disabled={arcs.length === 0} onClick={run}>
          {running ? "❚❚" : "▶"}
        </Button>
        <Button disabled={!running} onClick={reset}>
          ⭯
        </Button>
      </div>
    ),
    [arcs.length, reset, run, running]
  );

  useEffect(() => {
    if (data.elements && data.arcs && data.marking) {
      setElements(data.elements);
      setArcs(data?.arcs);
      setMarking(data?.marking);
    } else {
      setElements({
        [DragTypes.PLACE]: {},
        [DragTypes.TRANSITION]: {},
      });
      setArcs([]);
      setMarking({});
    }
  }, [data]);

  return (
    <Container fluid>
      <Row className="pr-3 pl-3">
        <Row className="pr-3 pl-3 flex-column">
          <Col className="d-flex flex-column align-items-center toolbar-wrapper mb-3">
            <Toolbar />
          </Col>
          {exportButton}
          {connectButton}
          {resetButton}
          {startButton}
        </Row>
        <Col className="editor-wrapper">
          <div id="editor" className="editor" ref={drop}>
            {renderElements(DragTypes.PLACE)}
            {renderElements(DragTypes.TRANSITION)}
            {arcElements}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
