import { truncate, promises } from "fs";

type MediaExtension = "ts" | "aac";

export default async function createMergeFile(
  fileName: string,
  urlList: Array<string>,
  saveLocation: string,
  extension: MediaExtension,
  testPath = false
) {
  const mergeFilePath = testPath
    ? `src/api/src/testData/downloadVodPlaylist/${fileName}.txt`
    : `./src/processing/${fileName}.txt`;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  truncate(mergeFilePath, 0, () => {});

  for (let i = 0; i < urlList.length; i++) {
    await promises.writeFile(
      mergeFilePath,
      `file '${saveLocation}/${i}.${extension}'\n`,
      { flag: "a" }
    );
  }
}