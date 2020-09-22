import React from "react";
import classNames from "classnames";
import { useAuthState } from "../../context/auth";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";

export default function Message(props) {
  const { user } = useAuthState();
  const sent = props.message.from === user.username;
  const received = !sent;

  return (
    <OverlayTrigger
      placement={sent ? "left" : "right"}
      overlay={
        <Tooltip>
          {moment(props.message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
        </Tooltip>
      }
      transition={false}
    >
      <div
        className={classNames("d-flex my-3", {
          "ml-auto": sent,
          "mr-auto": received,
        })}
      >
        <div
          className={classNames("py-2 px-3 rounded-pill", {
            "bg-primary": sent,
            "bg-secondary": received,
          })}
        >
          <p className={classNames({ "text-white": sent })}>
            {props.message.content}
          </p>
        </div>
      </div>
    </OverlayTrigger>
  );
}
