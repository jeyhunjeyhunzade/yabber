import React from "react";
import { Loader, Dimmer } from "semantic-ui-react";
import "../styles/Spinner.sass";

const Spinner = () => (
  <Dimmer active className="loader-container">
    <Loader size="huge" content={"Loading..."} />
  </Dimmer>
);

export default Spinner;
