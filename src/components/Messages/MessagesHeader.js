import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

class MessagesHeader extends React.Component {
  render() {
    const {
      channelName,
      handleStar,
      isChannelStarred,
      countUsers,
      handleSearchChange,
      searchLoading,
      isPrivateChannel
    } = this.props;

    return (
      <Segment clearing>
        {/* Channel Title */}
        <Header
          fluid="true"
          as="h2"
          floated="left"
          className="message-header--title"
        >
          <span>
            {channelName}{" "}
            {!isPrivateChannel && (
              <Icon
                name={isChannelStarred ? "star" : "star outline"}
                color={isChannelStarred ? "yellow" : "black"}
                onClick={handleStar}
              />
            )}
          </span>
          <Header.Subheader className="message-header--users">
            {countUsers}
          </Header.Subheader>
        </Header>
        {/* Channel Search Input */}
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchItem"
            onChange={handleSearchChange}
            loading={searchLoading}
            placeholder="Search Message"
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
