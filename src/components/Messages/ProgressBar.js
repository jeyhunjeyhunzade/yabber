import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = ({ uploadState, percentOfUpload }) =>
  uploadState === "uploading" && (
    <Progress
      className="progressBar"
      percent={percentOfUpload}
      progress
      indicating
      size="medium"
      inverted
    />
  );

export default ProgressBar;
