import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";

const REGISTER_USER = gql`
  mutation register(
    $username: String
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;

export default () => {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [registerUser, { loading, data, error }] = useMutation(REGISTER_USER, {
    update(_, res) {
      console.log(res);
    },
    onError(err) {
      console.log(err);
    },
  });

  const submitRegisterForm = (e) => {
    e.preventDefault();
    registerUser({ variables });
  };

  return (
    <>
      {" "}
      <Row className="bg-white py-3 justify-content-center">
        <Col sm={8} md={6} lg={4}>
          <h1 className="text-center">Register</h1>
          <Form onSubmit={submitRegisterForm}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={variables.username}
                onChange={(e) =>
                  setVariables({ ...variables, username: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={variables.email}
                onChange={(e) =>
                  setVariables({ ...variables, email: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={variables.password}
                onChange={(e) =>
                  setVariables({ ...variables, password: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm Password </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter confirm password"
                value={variables.confirmPassword}
                onChange={(e) =>
                  setVariables({
                    ...variables,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="success" type="submit">
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
};
