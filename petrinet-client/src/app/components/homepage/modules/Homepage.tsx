import React, { useCallback, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export interface HomepageProps {
  openEditor?: any;
  resetEditor?: any;
}

export default function Homepage(props: HomepageProps) {
  const { openEditor, resetEditor } = props;
  const [show] = useState<boolean>(true);
  const history = useHistory();
  const input = React.createRef<HTMLInputElement>();

  const importNet = useCallback(
    (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event) => {
        const data = JSON.parse(event.target?.result as string);
        openEditor(data);
        history.push("/editor");
      };
    },
    [history, openEditor]
  );

  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>Here you can create or import a Petri Net!</Modal.Title>
      </Modal.Header>
      <Modal.Footer className="editor-mode-picker">
        <Button
          variant="success"
          onClick={() => {
            resetEditor();
            history.push("/editor");
          }}
        >
          New
        </Button>
        <Button variant="primary" onClick={() => input.current?.click()}>
          Import
          <input
            id="file-input"
            type="file"
            ref={input}
            hidden
            onChange={importNet}
          />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
