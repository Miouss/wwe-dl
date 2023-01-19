import jsonfile from "jsonfile";

import GetAuthToken from "../../models/POST/RetrievePlaylist/GetAuthToken";
import GetVodDetails from "../../models/POST/RetrievePlaylist/GetVodDetails";
import GetVodPlaylistUrl from "../../models/POST/RetrievePlaylist/GetVodPlaylistUrl";
import getVodStreams from "../../models/POST/RetrievePlaylist/GetVodStreams";

import { Request, Response } from "express";

import { Media } from "../../../types/Media";
import { Metadata } from "../../../types/Metadata";
import { PlaylistUrl } from "../../../types/PlaylistUrl";

import { writeConfig } from "../../../Electron/events/handler";

export default async function RetrievePlaylist(req: Request, res: Response) {
  try {
    const configPath = "./src/Node/config.json";
    const configData = await jsonfile.readFile(configPath);

    const realm: string = configData.realm;
    const apikey: string = configData.apikey;
    let username: string | undefined = undefined;
    let password: string | undefined = undefined;

    if (req.body.saveCredentials) {
      username = req.body.account.username;
      password = req.body.account.password;
    } else if (req.body.useSavedCredentials) {
      username = configData.username;
      password = configData.password;
    }

    const authToken = await GetAuthToken(username, password, realm, apikey);

    if (req.body.saveCredentials) {
      writeConfig({ ...configData, username, password });
    }

    const vodDetails : Metadata = await GetVodDetails(req.body.url);

    const vodPlaylistUrl : PlaylistUrl = await GetVodPlaylistUrl(
      authToken,
      vodDetails.vodId,
      realm,
      apikey
    );

    const mediaSelection : Media = await getVodStreams(vodPlaylistUrl);

    mediaSelection.VideoSelection.sort((a, b) => {
      return parseInt(a["Average-Bandwidth"]) >=
        parseInt(b["Average-Bandwidth"])
        ? -1
        : 1;
    });

    mediaSelection.title = vodDetails.title;
    mediaSelection.thumbnail = vodDetails.thumbnail;
    mediaSelection.description = vodDetails.description;

    res.status(200);
    res.json(mediaSelection);
  } catch (err) {
    res.send(err.message);
  }
}
