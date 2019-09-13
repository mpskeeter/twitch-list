import fetch from 'node-fetch';
import Firebase from './firebase';

import { TwitchUsersFollows, TwitchStream, TwitchStreams, TwitchUsers, TwitchUser, TwitchClips, TwitchSubscriptionError, TwitchSubscriptionSuccess, TwitchClip } from 'src/app/twitch-helix/models';
import { CallbackInterface, ErrorResponse, SuccessResponse } from './http-responses';
import { TwitchHelixFollowedStreamComponent } from 'src/app/twitch-helix/components';

require('dotenv').config();

export interface Parameter {
  param: string;
  value: string[] | string;
}

interface ClipsArray {
  [key: string]: TwitchClips;
}



export default class Twitch {
  private baseUrl = 'https://api.twitch.tv/';
  incomingHeaders: any;
  protected headers: any;
  protected db = new Firebase()

  constructor(incomingHeaders: any) {
    this.incomingHeaders = incomingHeaders;
  }

  initializeHeaders = (apiVersion: string = 'helix') => {
    let authType: string = "Bearer";
    this.headers = {
      "Content-Type": "application/json",
      "Client-ID": this.incomingHeaders["client-id"],
    };

    if (apiVersion !== 'helix') {
      this.headers["Accept"] = "application/vnd.twitchtv.v5+json";
      this.headers["dataType"] = "jsonp";
      authType = "OAuth"
    }

    this.headers["Authorization"] = authType + ' ' + this.incomingHeaders["authorization"].replace('Bearer ', '');
  };

  BuildParams = (params: Parameter[]): string => {
    let retValue = params
      .map((param) => {
        if (!param) {
          return '';
        } else if (typeof param.value === 'string') {
          return `${param.param}=${param.value}`;
        } else if (Array.isArray(param.value)) {
          return param.value.map((value: string) => `${param.param}=${value}`).join('&');
        }
      })
      .join('&');

    if (retValue !== ([] || '')) {
      retValue = '?' + retValue;
    }

    return retValue;
  };

  merge = (a, b, p) => a.filter( aa => ! b.find ( bb => aa[p] === bb[p]) ).concat(b);

  fetch = async (API_ENDPOINT: string, headers ) => {
    const response = await fetch(API_ENDPOINT, { headers });
    const data = await response.json();
    return data;
    //   .then(
    //     (response) => response.json(),
    //     // (rejected) => { return ErrorResponse(rejected.message); },
    //   )
    //   .catch((error) => ErrorResponse(error.message))
    // ;
  }

  getFollowingList = async (userid: string) => {
    try {
      const API_ENDPOINT = this.baseUrl + 'helix/users/follows?from_id=' + userid + '&first=100';
      
      this.initializeHeaders('helix');

      const follows: TwitchUsersFollows = await this.fetch(API_ENDPOINT, this.headers);
      return follows.data.map((item) => item.to_id); 
    }
    catch(error) {
      return error;
    }
  };
     
  // getFollowingList = async () => {
  //   try {
  //     const API_ENDPOINT = this.baseUrl + 'helix/users/follows?from_id=' + this.incomingHeaders["userid"] + '&first=100';
      
  //     this.initializeHeaders('helix');

  //     return await this.fetch(API_ENDPOINT, this.headers)
  //       // .then((follows: TwitchUsersFollows) => follows)
  //       .then(
  //         async (follows: TwitchUsersFollows) => {
  //           const ids = follows.data.map((item) => item.to_id);
              
  //           // this.db.dbCollection = await this.db.setCollection('following');
  //           // await this.db.setBatch(follows.data, 'to_id', 'following', this.incomingHeaders["userid"])
  //           //   .catch((error) => ErrorResponse(error.message))
  //           // ;
  //           const returnResponse: CallbackInterface = await this.getUserList({param: 'id', value: ids})
  //             .catch((error) => ErrorResponse(error.message))
  //           ;
  //           return returnResponse;
  //         },
  //         // (rejected) => ErrorResponse(rejected.message),
  //       )
  //       .catch((error) => ErrorResponse(error.message))
  //     ;
  //   }
  //   catch(error) {
  //     return ErrorResponse(error.message);
  //   }
  // };

  getUserList = async (params: Parameter | Parameter[] | null) => {
    try {
      if (!Array.isArray(params)) {
        params = [params];
      }
  
      const API_ENDPOINT = this.baseUrl + 'helix/users' + this.BuildParams(params);
      this.initializeHeaders('helix');

      const response: TwitchUsers = await this.fetch(API_ENDPOINT, this.headers)
      const data: TwitchUser[] = response.data;
      return data;
    }
    catch(error) {
      return error;
    }
  }

  getClips = async (params: Parameter | Parameter[]) => {
    try {
      if (!Array.isArray(params)) {
        params = [params];
      }
  
      const API_ENDPOINT = this.baseUrl + 'helix/clips' + this.BuildParams(params);
      this.initializeHeaders('helix');

      const response: TwitchClips = await this.fetch(API_ENDPOINT, this.headers);
      const data: TwitchClip[] = response.data;
      return data;
    }
    catch(error) {
      return error;
    }
  }

  getClipsList = async (channels: string[]) => {
    try {
  
      this.initializeHeaders('helix');

      let clips: ClipsArray[] = [];

      return channels.map(async (channel) => {
        clips[channel] = await this.getClips([
          {param: 'broadcaster_id', value: channel},
          {param: 'first', value: '2'}
        ]);
        return clips[channel];
        // console.log(`clips[${channel}]`, clips[channel]);
        // console.log('clips[channel]: ', clips[channel]);
        // return clips[channel];
        // const API_ENDPOINT = this.baseUrl + 'kraken/clips/broadcaster_id/' + channel;
        // clips[channel] = await this.fetch(API_ENDPOINT, this.headers)  
        //   .then((clips: TwitchClips) => clips)
        // ;
      });
    }
    catch(error) {
      return error;
    }
  }

  getStreamList = async (params: Parameter | Parameter[])  => {
    try {
      if (!Array.isArray(params)) {
        params = [params];
      }
  
      const API_ENDPOINT = this.baseUrl + 'helix/streams' + this.BuildParams(params);
      this.initializeHeaders('helix');
  
      const response: TwitchStreams = await this.fetch(API_ENDPOINT, this.headers);
      const data: TwitchStream[] = response.data;
      return data;
        // .then(
        //   async (streams: TwitchStreams) => {
        //     const data: TwitchStream[] = streams.data;
        //     console.log('streams.data: ', streams.data);
            
        //     // this.db.dbCollection = await this.db.setCollection('channels');
        //     // return await this.db.setBatch(data, 'id')
        //     //   .catch((error) => ErrorResponse(error.message))
        //     // ;
        //   },
        //   // (rejected) => ErrorResponse(rejected.message),
        // )
        // .catch((error) => ErrorResponse(error.message))
    }
    catch(error) {
      return error;
    }
  }

  getSubscription = async (user: string, channel_id: string) => {
    const API_ENDPOINT = this.baseUrl + 'kraken/users/' + user + '/subscriptions/' + channel_id;
    this.initializeHeaders('kraken');

    console.log('headers: ', this.headers);

    const response: TwitchSubscriptionSuccess | TwitchSubscriptionError = await this.fetch(API_ENDPOINT, this.headers);

    const success: TwitchSubscriptionSuccess = response as TwitchSubscriptionSuccess;
    if (success.channel !== undefined) {
      console.log('subscription: success: ', success);
      return success;
    }
    
    const error: TwitchSubscriptionError = response as TwitchSubscriptionError;
    if (error.status) {
      return error;
    }
    // const 
    //   .then((subscription: TwitchSubscriptionSuccess | TwitchSubscriptionError) => subscription)
    //   .then(subscription => subscription)
    // ;
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

}
