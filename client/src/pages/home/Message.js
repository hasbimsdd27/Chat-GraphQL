import React, { useState } from "react";
import classNames from "classnames";
import { useAuthState } from "../../context/auth";
import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import moment from "moment";

const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];

const REACT_TO_MESSAGE = gql`
  mutation reactToMessage($uuid: String!, $content: String!) {
    reactToMessage(uuid: $uuid, content: $content) {
      uuid
    }
  }
`;

export default function Message(props) {
  const { user } = useAuthState();
  const sent = props.message.from === user.username;
  const received = !sent;
  const [showPopover, setShowPopover] = useState(false);

  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => {
      setShowPopover(false);
    },
  });

  const ReactionsIcons = [
    ...new Set(props.message.reactions.map((r) => r.content)),
  ];

  const react = (reaction) => {
    reactToMessage({
      variables: { uuid: props.message.uuid, content: reaction },
    });
  };

  const reactButton = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      show={showPopover}
      onToggle={setShowPopover}
      transition={false}
      rootClose
      overlay={
        <Popover className="rounded-pill">
          <Popover.Content className="d-flex px-0 p-y-1 align-items-center react-button-popover">
            {reactions.map((reaction) => (
              <Button
                variant="link"
                className="react-icon-button"
                key={reaction}
                onClick={() => react(reaction)}
              >
                {reaction}
              </Button>
            ))}
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant="link" className="px-2">
        <i className="far fa-smile" />
      </Button>
    </OverlayTrigger>
  );

  return (
    <div
      className={classNames("d-flex my-3", {
        "ml-auto": sent,
        "mr-auto": received,
      })}
    >
      {sent && reactButton}
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
          className={classNames("py-2 px-3 rounded-pill position-relative", {
            "bg-primary": sent,
            "bg-secondary": received,
          })}
        >
          {props.message.reactions.length > 0 && (
            <div className="reactions-div bg-secondary p-1 rounded-pill">
              {ReactionsIcons} {props.message.reactions.length}
            </div>
          )}
          <p className={classNames({ "text-white": sent })}>
            {props.message.content}
          </p>
        </div>
      </OverlayTrigger>
      {received && reactButton}
    </div>
  );
}
