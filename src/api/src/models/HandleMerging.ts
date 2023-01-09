import Listr from "listr";

import { mergingTask, deletingTask } from "../tasks/tasks";

export default async function handleMerging(
  vodTitle: string,
  outputPath: string
) {
  const mergingVideoFrags = [
    "-y",
    "-safe",
    "0",
    "-f",
    "concat",
    "-i",
    "listVideo.txt",
    "-c",
    "copy",
    `${outputPath}\\output.ts`,
  ];

  const mergingAudioFrags = [
    "-y",
    "-safe",
    "0",
    "-f",
    "concat",
    "-i",
    "listAudio.txt",
    "-c",
    "copy",
    `${outputPath}\\output.aac`,
  ];

  const mergingVideoWithAudio = [
    "-y",
    "-i",
    `${outputPath}\\output.ts`,
    "-i",
    `${outputPath}\\output.aac`,
    "-c",
    "copy",
    `"${outputPath}\\${vodTitle
      // eslint-disable-next-line no-useless-escape
      .replace(/[\/]/g, "-")
      // eslint-disable-next-line no-useless-escape
      .replace(/[\/\\:*?"<>]/g, "")}".mp4`,
  ];

  const mergingTasks = new Listr([
    mergingTask(
      "Merging Video Fragments",
      mergingVideoFrags,
      "merging-video-starts",
      "merging-video-ends"
    ),
    mergingTask(
      "Merging Audio Fragments",
      mergingAudioFrags,
      "merging-audio-starts",
      "merging-audio-ends"
    ),
    deletingTask(
      "Deleting Video & Audio Fragments",
      "del-frag-src",
      outputPath,
      "deleting-frags-starts",
      "deleting-frags-ends"
    ),
    mergingTask(
      "Merging Video with Audio",
      mergingVideoWithAudio,
      "merging-parts-starts",
      "merging-parts-ends"
    ),
    deletingTask(
      "Deleting Video and Audio Parts",
      "del-full-src",
      outputPath,
      "deleting-parts-starts",
      "deleting-parts-ends"
    ),
  ]);

  await mergingTasks.run();
}
