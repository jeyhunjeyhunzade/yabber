import React from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? "myMessage" : "";
};

const isImage = message => {
  return message.hasOwnProperty("image");
};

const timeFromNow = timestamp => moment(timestamp).fromNow();

const Message = ({ message, user }) => (
  <Comment className="message">
    <Comment.Avatar src={message.user.avatar} />
    <Comment.Content className={isOwnMessage(message, user)}>
      <Comment.Author as="a">{message.user.name}</Comment.Author>
      <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
      {isImage(message) ? (
        <Image src={message.image} className="message-image" />
      ) : (
        <Comment.Text>{message.content}</Comment.Text>
      )}
    </Comment.Content>
  </Comment>
);

export default Message;
