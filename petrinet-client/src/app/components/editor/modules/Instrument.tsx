import React, { CSSProperties, useMemo, useRef, useState } from "react";
import {
  Button,
  FormControl,
  InputGroup,
  Overlay,
  Popover,
} from "react-bootstrap";
import { useDrag } from "react-dnd";
import "../styles/Toolbar.scss";
import { DragTypes } from "../types/DragTypes";

export interface InstrumentProps {
  id: string;
  type?: DragTypes;
  name?: string;
  setName?: any;
  style?: CSSProperties;
  connectionMode?: boolean;
  onClick?: any;
  onDelete?: any;
  tokens?: number;
  setTokens?: any;

  enabled?: boolean;
  fire?: any;
  running?: boolean;
}
export default function Instrument(props: InstrumentProps) {
  const {
    id,
    type,
    name,
    setName,
    style,
    connectionMode,
    onClick,
    onDelete,
    tokens,
    setTokens,
    enabled,
    fire,
    running,
  } = props;
  const [className, setClassName] = useState<string>("");
  const [isMenuVisible, setMenuVisible] = useState<boolean>();
  const [menuToggle, setMenuToggle] = useState<any>();
  const InstrumentContainer = useRef(null);

  const Tokens = useMemo(() => {
    if (!tokens || type !== DragTypes.PLACE || tokens === 0) return null;
    if (tokens > 4) {
      return <div className="token text">{tokens}</div>;
    }

    const toRender: JSX.Element[] = [];
    for (let index = 0; index < tokens; index++) {
      toRender.push(<div key={index} className="token"></div>);
    }

    return toRender;
  }, [tokens, type]);

  const [{ isDragging }, drag] = useDrag({
    type: type ?? DragTypes.PLACE,
    item: { id, type, tokens },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  if (className === "") {
    setClassName(
      id?.split("-")[0] + " d-flex flex-column justify-content-center"
    );
  }

  // makes short labels when item is placed inside the editor div
  let label = name;
  if (!label) {
    const splittedId = id?.split("-");
    label =
      splittedId?.length !== 1
        ? `${splittedId?.[0][0].toUpperCase()}-${splittedId?.[1]}`
        : id;
  }
  if (enabled) {
    label = "enabled";
  }

  const popover = (
    <Popover id="instrument-menu" onMouseLeave={() => setMenuVisible(false)}>
      <Popover.Content>
        <label>Name</label>
        <InputGroup className="mb-3">
          <FormControl
            className="rounded"
            placeholder={name ?? "Input a name"}
            aria-label="Name"
            onChange={(event) => {
              let name: string | undefined = event.target.value;
              if (name.length === 0) name = undefined;
              setName(id, type, name);
            }}
          />
        </InputGroup>
        {type === DragTypes.PLACE ? (
          <div>
            <label>Tokens</label>
            <InputGroup className="mb-3">
              <FormControl
                className="rounded"
                placeholder={tokens?.toString() ?? "No tokens"}
                aria-label="Tokens"
                onChange={(event) => {
                  let tokens = parseInt(event.target.value);
                  if (isNaN(tokens)) tokens = 0;
                  setTokens(id, tokens);
                }}
              />
            </InputGroup>
          </div>
        ) : null}
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete({ id, type })}
        >
          Delete
        </Button>
      </Popover.Content>
    </Popover>
  );

  const instrument = (
    <div
      className={
        className +
        (isDragging ? " dragging" : "") +
        (connectionMode ? " cm" : "")
      }
      ref={drag}
      id={id}
      style={style}
      onClick={(event) => {
        if (connectionMode && !running) {
          onClick(event);
          return;
        }

        if (type === DragTypes.TRANSITION && enabled && running) {
          fire(id);
          return;
        }
      }}
      onDoubleClick={(event) => {
        setMenuVisible(!isMenuVisible);
        setMenuToggle(event.target);
      }}
    >
      {tokens !== 0 && Tokens ? (
        <div className="token-wrapper">{Tokens}</div>
      ) : (
        <label className="pt-1 pl-1 pr-1" htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );

  return (
    <div ref={InstrumentContainer}>
      <Overlay
        show={isMenuVisible}
        placement="top"
        target={menuToggle}
        container={InstrumentContainer}
      >
        {popover}
      </Overlay>
      {instrument}
    </div>
  );
}
