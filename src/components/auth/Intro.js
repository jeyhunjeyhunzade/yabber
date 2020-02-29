import React from "react";
import { Button, Message } from "semantic-ui-react";
import Modal from "react-awesome-modal";
import "../../styles/Intro.sass";

export default class Examples extends React.Component {
  state = {
    visible: false,
    autoPlayIntro: false
  };

  componentDidMount() {
    setTimeout(() => this.openModal(), 2000);
  }

  openModal() {
    this.setState({
      visible: true
    });
  }

  closeModal() {
    this.setState({
      visible: false
    });
    this.refs.introRef.pause();
  }

  render() {
    return (
      <section className="intro-container">
        <Modal
          visible={this.state.visible}
          width="500"
          height="400"
          effect="fadeInUp"
          onClickAway={() => this.closeModal()}
        >
          <div>
            <h1 className="intro-h">Just 2 minutes, check on intro :)</h1>
            <video
              ref="introRef"
              width="500"
              height="280"
              controls
              style={{ outline: 0 }}
              autoPlay={this.state.autoPlayIntro}
              src="https://firebasestorage.googleapis.com/v0/b/love-chat-72fed.appspot.com/o/exmedia%2FYabber_intro.mp4?alt=media&token=89fb0575-d450-41c1-9718-f2c49155a788"
            />
            <div className="intro-btn_container">
              <Button
                color="yellow"
                className="intro-btn"
                onClick={() => this.closeModal()}
              >
                Let's start!
              </Button>
            </div>
          </div>
        </Modal>
      </section>
    );
  }
}
