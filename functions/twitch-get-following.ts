// import fetch from "node-fetch";
// import Firebase from './libs/firebase';
import Twitch from './libs/twitch';
import { UnAuthorized, ErrorResponse, SuccessResponse } from './libs/http-responses';

import * as environment from './libs/twitch-settings.json';
import { TwitchUser, TwitchStream, TwitchClip } from 'src/app/twitch-helix/models';

interface ClipsInterface {
  [id: string]: TwitchClip[];
}

exports.handler = async function (event, context, callback) {

  const headers = event.headers;

  if (headers["client-id"] !== environment.twitchClientId) {
    return UnAuthorized;
  }

  let twitch = new Twitch(headers);

  return await twitch.getFollowingList(headers.userid)
    .then(
      async (channel_ids: string[]) => {
        let channels = await twitch.getUserList({param: 'id', value: channel_ids})
          .then((channels: TwitchUser[]) => channels)
        ;

        const streams = await twitch.getStreamList({param: 'user_id', value: channel_ids})
          .then((streams: TwitchStream[]) => streams)
        ;

        const channelPromise = channels.map(async (channel) => {
          const id = channel.id;

          channel.stream = streams.find((stream) => stream.user_id === id);

          const clipsPromise = await twitch.getClips([
            {param: 'broadcaster_id', value: id},
            {param: 'first', value: '2'}
          ]);
          channel.clips = await Promise.all(clipsPromise);

          const subscriptions = await twitch.getSubscription(headers.userid, id);
          channel.subscription = subscriptions;

          return channel;
        });

        channels = await Promise.all(channelPromise);

        return SuccessResponse(JSON.stringify(channels));
      },
      (rejected) => ErrorResponse(rejected.message),
    )
    .catch(error => ErrorResponse(error.message));
}
