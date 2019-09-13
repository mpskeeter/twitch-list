// import fetch from "node-fetch";
// import Firebase from './libs/firebase';
import Twitch from './libs/twitch';
import { UnAuthorized, ErrorResponse, SuccessResponse } from './libs/http-responses';

import { environment } from './libs/twitch-settings';
import { TwitchUser, TwitchStream, TwitchClip, TwitchSubscriptionSuccess, TwitchSubscriptionError, TwitchClips } from 'src/app/twitch-helix/models';


interface ClipsInterface {
  [id: string]: TwitchClip[];
}

exports.handler = async function (event, context, callback) {

  const headers = event.headers;

  if (headers["client-id"] !== environment.twitchClientId) {
    return UnAuthorized;
  }

  let twitch = new Twitch(headers);

  // async function getClips (channel_id: string) {
  //   return await twitch.getClipsList({param: 'broadcaster_id', value: channel_id})
  //     .then((clips: TwitchClip[]) => clips)
  //   ;
  // }

  return await twitch.getFollowingList(headers.userid)
    .then(
      async (channel_ids: string[]) => {
        let channels = await twitch.getUserList({param: 'id', value: channel_ids})
          .then((channels: TwitchUser[]) => channels)
        ;

        const streams = await twitch.getStreamList({param: 'user_id', value: channel_ids})
          .then((streams: TwitchStream[]) => streams)
        ;

        // // let clipsArray: Array<TwitchClips[]>;
        // let twitchClips: TwitchClips[] = [];
        // let clipsInterface: ClipsInterface;

        // const clipsPromise = channel_ids.map((id: string) => {
        //   twitchClips[id] = twitch.getClips([
        //     {param: 'broadcaster_id', value: id},
        //     {param: 'first', value: '2'}
        //   ])
        //     .then((clips: TwitchClip[]) => clips);
          
        //   // console.log(`twitchClips[${id}]: `, twitchClips[id]);

        //   return twitchClips[id];
        // });

        // const clips = await Promise.all(clipsPromise);

        // console.log(clips)

        const channelPromise = channels.map(async (channel) => {

          // async function getClips(channel_id: string) {
          //   const response = await twitch.getClips([
          //     {param: 'broadcaster_id', value: channel_id},
          //     {param: 'first', value: '2'}
          //   ]);
          //   return await response.json();
          //     // .then((clips: TwitchClips) => clips.data)
          //   ;  
          // }

          const id = channel.id;
          channel.stream = streams.find((stream) => stream.user_id === id);

          const clipsPromise = await twitch.getClips([
            {param: 'broadcaster_id', value: id},
            {param: 'first', value: '2'}
          ]);
          channel.clips = await Promise.all(clipsPromise);

          const subscriptions = await twitch.getSubscription(headers.userid, id);
            // .then((subscription) => {
            //   if (subscription.channel !== undefined) {
            //     return subscription;
            //   }
            // });
          // channel.subscription = await Promise.all(subscriptions);
          channel.subscription = subscriptions;

          // const clips = Promise.all([clipsPromise])

          // const subscription = Promise.all([subscriptionPromise])
            // .then((values) => {
            //   console.log(values);
            // })
          ;

          // console.log(clips);
          // console.log(subscription);


          // console.log(`twitchClips[${id}]: `, twitchClips[id]);

          // channel.clips = twitchClips[id];

          // console.log('channel.clips: ', channel.clips);
          return channel;
        });

        channels = await Promise.all(channelPromise);

        return SuccessResponse(JSON.stringify(channels));
      },
      (rejected) => ErrorResponse(rejected.message),
    )
    .catch(error => ErrorResponse(error.message));
}


// getUserList = async (params: Parameter | Parameter[] | null) => {
//   try {
//     let newParams = params;
//     let values: string[] | string;
//     if (!Array.isArray(newParams)) {
//       values = newParams.value;
//       newParams = [newParams];
//     }

//     const API_ENDPOINT = this.baseUrl + 'helix/users' + this.BuildParams(newParams);
//     this.initializeHeaders('helix');

//     return await this.fetch(API_ENDPOINT, this.headers)  
//      .then(
//         async (list: TwitchUsers) => {
//           let users: TwitchUser[] = list.data;
//           const streamers = await this.getStreamList({param: 'user_id', value: values})
//             .then((streams: TwitchStreams) => streams)
//             .then(
//               (streams) => streams.data.map((stream) => {
//                 const user = users.find((user) => user.id === stream.user_id);
//                 if (user) {
//                   user.stream = stream;
//                   return user;
//                 }
//               })
//             )
//             .catch((error) => ErrorResponse(error.message))
//           ;
//           // console.log('newData: ', newData);
//           users = this.merge(streamers, users, 'id')
//           // console.log('merged data: ', users);
          

//           // console.log('merged data: ', data);
//           // this.db.dbCollection = await this.db.setCollection('channels');
//           // await this.db.setBatch(users, 'id')
//           //   .catch((error) => ErrorResponse(error.message))
//           // ;
//           return SuccessResponse(JSON.stringify(users));
//         },
//         // (rejected) => ErrorResponse(rejected.message),
//       )
//       .catch((error) => ErrorResponse(error.message))
//     ;
//   }
//   catch(error) {
//     return ErrorResponse(error.message);
//   }
// }
