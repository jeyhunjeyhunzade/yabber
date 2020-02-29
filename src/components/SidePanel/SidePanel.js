import React from "react";
import { Menu } from "semantic-ui-react";
import "../../styles/SideMenu.sass";
import UserPanel from "./UserPanel";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";

class SidePanel extends React.Component {
  render() {
    const { currentUser } = this.props;

    return (
      <Menu size="large" inverted fixed="left" vertical className="sideMenu">
        <UserPanel currentUser={currentUser} />
        <Starred currentUser={currentUser} />
        <Channels currentUser={currentUser} />
        <DirectMessages currentUser={currentUser} />
      </Menu>
    );
  }
}

export default SidePanel;
