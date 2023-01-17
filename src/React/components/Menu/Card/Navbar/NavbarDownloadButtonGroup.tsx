import React, { Dispatch, SetStateAction } from "react";

import NavbarDownloadButton from "./DownloadButtonGroup/DownloadButton";
import NavbarDownloadDisabledButton from "./DownloadButtonGroup/DownloadDisabledButton";
import NavbarHomeButton from "./DownloadButtonGroup/HomeButton";
import NavbarRetryButton from "./DownloadButtonGroup/RetryButton";

interface Props {
  setResetSelection: Dispatch<SetStateAction<boolean>>;
  setDownloadStarted: Dispatch<SetStateAction<boolean>>;
  setBackHome: Dispatch<SetStateAction<boolean>>;
  downloadStarted: boolean;
  mediaDownloaded: boolean;
  downloadButtonLabel: string;
  mediaSelected: boolean;
}

export default function NavbarDownloadButtonGroup({
  setDownloadStarted,
  setResetSelection,
  setBackHome,
  downloadStarted,
  mediaDownloaded,
  downloadButtonLabel,
  mediaSelected,
}: Props) {
  const waitingDownload = mediaSelected && !mediaDownloaded;

  return (
    <>
      <NavbarHomeButton setBackHome={setBackHome} />
      <NavbarRetryButton setResetSelection={setResetSelection} />

      {waitingDownload ? (
        <NavbarDownloadButton
          setDownloadStarted={setDownloadStarted}
          downloadStarted={downloadStarted}
          mediaDownloaded={mediaDownloaded}
        >
          {downloadButtonLabel}
        </NavbarDownloadButton>
      ) : (
        <NavbarDownloadDisabledButton />
      )}
    </>
  );
}