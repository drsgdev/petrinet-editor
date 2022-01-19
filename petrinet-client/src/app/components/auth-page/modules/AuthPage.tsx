import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";

interface AuthProps {
  login?: any;
}

export default function AuthPage(props: AuthProps) {
  const { login } = props;
  const [signup, setSignup] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const history = useHistory();

  return (
    <div className="d-flex justify-content-center">
      <div className="border rounded col-5 position-fixed pt-3 pb-3">
        <Form>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              id="username_input"
              name="username_input"
              type="text"
              placeholder="Enter username"
              maxLength={50}
              onChange={(event) => {
                const name = event.target.value;
                if (signup) {
                  setUsername(name);
                  return;
                }
              }}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              id="password_input"
              name="password_input"
              type="password"
              placeholder="Enter password"
              maxLength={50}
              onChange={(event) => {
                const pw = event.target.value;
                if (signup) {
                  setPassword(pw);
                  return;
                }
              }}
              required
            />
          </Form.Group>
          <div className="d-flex flex-row justify-content-between">
            <Button
              type="submit"
              onClick={() => {
                if (signup) {
                  setSignup(false);
                  return;
                }

                if (
                  username &&
                  password &&
                  username !== "" &&
                  password !== ""
                ) {
                  login({ username, password });
                  history.push("/");
                }
              }}
            >
              {signup ? "Signup" : "Login"}
            </Button>
            <Button
              variant="link"
              type="link"
              onClick={() => setSignup(!signup)}
            >
              {signup ? "Already have an account?" : "Doesn't have an account?"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
