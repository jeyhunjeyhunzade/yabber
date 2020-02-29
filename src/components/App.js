import React from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import "./App.sass";

import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";

const App = ({ currentUser, currentChannel, isPrivateChannel, userPosts }) => (
  <Grid columns="equal" className="app" style={{ background: "#eee" }}>
    <SidePanel key={currentUser && currentUser.uid} currentUser={currentUser} />

    <Grid.Column className="messages-container">
      <Messages
        key={currentChannel && currentChannel.id}
        currentUser={currentUser}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
      />
    </Grid.Column>

    <Grid.Column width={4}>
      <MetaPanel
        key={currentChannel && currentChannel.id}
        isPrivateChannel={isPrivateChannel}
        currentChannel={currentChannel}
        userPosts={userPosts}
      />
    </Grid.Column>
  </Grid>
);

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts
});

export default connect(mapStateToProps)(App);
