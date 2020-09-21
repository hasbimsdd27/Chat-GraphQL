import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";
import { gql, useQuery } from "@apollo/client";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      email
      createdAt
    }
  }
`;

export default function Home(props) {
  const dispatch = useAuthDispatch();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    props.history.push("/login");
  };

  const { loading, data, error } = useQuery(GET_USERS);
  if (error) {
    console.log(error);
  }
  if (data) {
    console.log(data);
  }

  let usersMarkup;
  if (!data || loading) {
    usersMarkup = <p>Loading...</p>;
  } else if (data.getUsers.length === 0) {
    usersMarkup = <p>No users have join yet...</p>;
  } else {
    usersMarkup = data.getUsers.map((item) => (
      <div key={item.username}>
        <p>{item.username}</p>
      </div>
    ));
  }

  return (
    <>
      <Row className="bg-white justify-content-around mb-1">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>

        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>
      <Row>
        <Col xs={4} className="bg-white">
          {usersMarkup}
        </Col>
        <Col xs={8} className="bg-white">
          <p>Messages</p>
        </Col>
      </Row>
    </>
  );
}
