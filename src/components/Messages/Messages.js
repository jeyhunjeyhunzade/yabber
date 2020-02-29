import React from "react";
import { connect } from "react-redux";
import { setUserPosts } from "../../actions";

import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";
import TypingAnimation from "./TypingAnimation";
import Skeleton from "./Skeleton";
import "../../styles/Messages.sass";

class Messages extends React.Component {
  state = {
    usersRef: firebase.database().ref("users"),
    messagesRef: firebase.database().ref("messages"),
    privateMessagesRef: firebase.database().ref("privateMessages"),
    typingRef: firebase.database().ref("typing"),
    connectedRef: firebase.database().ref(".info/connected"),
    typingUsers: [],
    messages: [],
    messagesLoading: true,
    progressBar: false,
    user: this.props.currentUser,
    countUsers: "",
    channel: this.props.currentChannel,
    isChannelStarred: false,
    privateChannel: this.props.isPrivateChannel,
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
    listeners: [],
    removeSkeleton: false
  };

  componentDidMount() {
    const { user, channel, listeners } = this.state;
    if (user && channel) {
      this.removeListeners(listeners);
      this.addListeners(channel.id);
      this.addUsersStarsListener(channel.id, user.uid);
    }

    setTimeout(() => {
      this.setState({ removeSkeleton: true });
    }, 1500);
  }

  componentWillUnmount() {
    this.removeListeners(this.state.listeners);
    this.state.connectedRef.off();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.messagesEnd) {
      this.autoScrollToBottom();
    }
  }

  addToListeners = (id, ref, event) => {
    const index = this.state.listeners.findIndex(listener => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });
    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({ listeners: this.state.listeners.concat(newListener) });
    }
  };

  removeListeners = listeners => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };

  autoScrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  addListeners = channelId => {
    this.addMessageListener(channelId);
    this.addTypingListeners(channelId);
  };

  addTypingListeners = channelId => {
    let typingUsers = [];
    this.state.typingRef.child(channelId).on("child_added", snap => {
      if (snap.key !== this.state.user.uid) {
        typingUsers = typingUsers.concat({
          id: snap.key,
          name: snap.val()
        });
        this.setState({ typingUsers });
      }
    });
    this.addToListeners(channelId, this.state.typingRef, "child_added");

    this.state.typingRef.child(channelId).on("child_removed", snap => {
      const index = typingUsers.findIndex(user => user.id === snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== snap.key);
        this.setState({ typingUsers });
      }
    });
    this.addToListeners(channelId, this.state.typingRef, "child_removed");

    this.state.connectedRef.on("value", snap => {
      if (snap.val() === true) {
        this.state.typingRef
          .child(channelId)
          .child(this.state.user.uid)
          .onDisconnect()
          .remove(err => {
            if (err !== null) {
              console.error(err);
            }
          });
      }
    });
  };

  addUsersStarsListener = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child("starred")
      .once("value")
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          this.setState({ isChannelStarred: prevStarred });
        }
      });
  };

  addMessageListener = channelId => {
    const loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
      this.countUserPosts(loadedMessages);
    });
    this.addToListeners(channelId, ref, "child_added");
  };

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const multiUser = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const countUsers = `${uniqueUsers.length} user${multiUser ? "s" : ""}`;
    this.setState({ countUsers });
  };

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        };
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
  };

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  displayChannelName = channel => {
    return channel
      ? `${this.state.privateChannel ? "@" : "#"}${channel.name}`
      : "";
  };

  displayTypingUsers = users =>
    users.length > 0 &&
    users.map(user => (
      <div className="typing-container" key={user.id}>
        <span className="user-typing">{user.name} is typing</span>
        <TypingAnimation />
      </div>
    ));

  displayMessagesSkeleton = (loading, messages) => {
    return loading && !messages.length && !this.state.removeSkeleton ? (
      <>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} />
        ))}
      </>
    ) : null;
  };

  handleSearchChange = event => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  handleStar = () => {
    this.setState(
      prevState => ({
        isChannelStarred: !prevState.isChannelStarred
      }),
      () => this.starChannel()
    );
  };

  starChannel = () => {
    if (this.state.isChannelStarred) {
      this.state.usersRef.child(`${this.state.user.uid}/starred`).update({
        [this.state.channel.id]: {
          name: this.state.channel.name,
          details: this.state.channel.details,
          createdBy: {
            name: this.state.channel.createdBy.name,
            avatar: this.state.channel.createdBy.avatar
          }
        }
      });
    } else {
      this.state.usersRef
        .child(`${this.state.user.uid}/starred`)
        .child(this.state.channel.id)
        .remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
    }
  };

  render() {
    const {
      messagesRef,
      messages,
      messagesLoading,
      user,
      typingUsers,
      channel,
      isChannelStarred,
      privateChannel,
      countUsers,
      searchTerm,
      searchResults,
      searchLoading
    } = this.state;

    return (
      <div className="messages-container">
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          countUsers={countUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />

        <Segment>
          <Comment.Group className="messages">
            {this.displayMessagesSkeleton(messagesLoading, messages)}
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
            {this.displayTypingUsers(typingUsers)}
            <div ref={node => (this.messagesEnd = node)}></div>
          </Comment.Group>
        </Segment>

        <MessagesForm
          messagesRef={messagesRef}
          currentUser={user}
          currentChannel={channel}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </div>
    );
  }
}

export default connect(null, { setUserPosts })(Messages);
