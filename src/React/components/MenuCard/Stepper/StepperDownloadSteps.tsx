import React, { useState } from "react";

import { Stack } from "@mui/material";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import FileCopyIcon from "@mui/icons-material/FileCopy";
import DifferenceIcon from "@mui/icons-material/Difference";
import MovieIcon from "@mui/icons-material/Movie";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import DownloadSteps from "./Download/DownloadSteps";
import { StyledStepConnector, StepLabelSx } from "../../styled/Stepper";
import { customizedStepIcon } from "../../../utils/stepper";

import { Task } from "../../../../types/Task";
import { task } from "../../../utils/task";

type Media = "Video" | "Audio";

interface Props {
  activeStep: number;
}

export default function StepperSteps({ activeStep }: Props) {
  const steps = [
    "Downloading Fragments",
    "Merging Fragments into Video and Audio Parts",
    "Merging Audio with Video",
    "Done",
  ];

  const [audioFrags, setAudioFrags] = useState<Task>({
    title: "waiting to download audio fragments",
    started: false,
    done: false,
  });
  const [videoFrags, setVideoFrags] = useState<Task>({
    title: "waiting to download video fragments",
    started: false,
    done: false,
  });

  const [videoPart, setVideoPart] = useState<Task>({
    title: "waiting to merge video fragments into single part",
    started: false,
    done: false,
  });
  const [audioPart, setAudioPart] = useState<Task>({
    title: "waiting to merge audio fragments into single part",
    started: false,
    done: false,
  });

  const [parts, setParts] = useState<Task>({
    title: "waiting to merge video and audio parts into mp4 file",
    started: false,
    done: false,
  });

  const download = {
    audioFrags,
    videoFrags,
  };
  const merge = {
    videoPart,
    audioPart,
    parts,
  };

  window.downloadAPI.onMergingVideoStarts(() =>
    task.start(setVideoPart, "Merging video's fragments into single part")
  );
  window.downloadAPI.onMergingAudioStarts(() =>
    task.start(setAudioPart, "Merging audio's fragments into single part")
  );

  window.downloadAPI.onMergingVideoEnds(() =>
    task.end(
      setVideoPart,
      "Video's fragments had been merged into single part successfully"
    )
  );
  window.downloadAPI.onMergingAudioEnds(() =>
    task.end(
      setAudioPart,
      "Audio's fragments had been merged into single part successfully"
    )
  );

  window.downloadAPI.onMergingPartsStarts(() =>
    task.start(setParts, "Merging video and audio parts into MP4 file")
  );
  window.downloadAPI.onMergingPartsEnds(() =>
    task.end(setParts, "Video and audio parts merged sucessfully")
  );

  window.downloadAPI.onUpdateDownloadSteps(
    (_: unknown, taskTitle: string, mediaType: Media) => {
      mediaType === "Audio"
        ? task.update(setAudioFrags, taskTitle)
        : task.update(setVideoFrags, taskTitle);
    }
  );

  window.downloadAPI.onDownloadStepsEnds((_: unknown, mediaType: Media) => {
    mediaType === "Audio"
      ? task.end(
          setAudioFrags,
          "Audio's fragments had been downloaded successfully"
        )
      : task.end(
          setVideoFrags,
          "Video's fragments had been downloaded successfully"
        );
  });

  const icons: { [index: string]: React.ReactElement } = {
    1: <FileCopyIcon />,
    2: <DifferenceIcon />,
    3: <MovieIcon />,
    4: <ThumbUpIcon />,
  };

  return (
    <>
      <Stepper
        activeStep={activeStep}
        connector={<StyledStepConnector />}
        alternativeLabel
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={(props) => customizedStepIcon(icons, props)}
              sx={StepLabelSx}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Stack direction={"column"} marginTop={"1rem"} marginBottom={"1rem"}>
        <DownloadSteps
          activeStep={activeStep}
          tasks={{ ...download, ...merge }}
        />
      </Stack>
    </>
  );
}