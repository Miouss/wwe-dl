import express, { Express } from "express";
import DownloadMedia from "./controller/POST/DownloadMedia";
import RetrievePlaylist from "./controller/POST/RetrievePlaylist";

import cors from "cors";

const appExpress = express();

appExpress.use(
  cors({
    origin: "http://localhost:3000",
  })
);

appExpress.use(express.urlencoded({ extended: true }));
appExpress.use(express.json());

appExpress.post("/stream/download", DownloadMedia);
appExpress.post("/stream/playlist", RetrievePlaylist);

export default appExpress;

export function startServer(appExpress: Express){
  return appExpress.listen(8000);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stopServer(server: any){
  server.close();
}


export function monitorPublicFolder(){
  appExpress.use(express.static('public'));
  appExpress.use('/testData', express.static('testData'));
}