import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TwitchAppToken } from './twitch-app-token';
import {
  TwitchFollows,
  TwitchUser,
  TwitchStreams
} from '../models';

import { environment } from '../../environments/environment';
import { isString, isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class TwitchApiService {
  private appToken = new BehaviorSubject<TwitchAppToken>(null);
  appToken$ = this.appToken.asObservable();

  private users = new BehaviorSubject<TwitchUser[]>(null);
  users$ = this.users.asObservable();

  private follows = new BehaviorSubject<TwitchFollows>(null);
  follows$ = this.follows.asObservable();

  private followedStream = new BehaviorSubject<TwitchStreams>(null);
  followedStream$ = this.followedStream.asObservable();

  accessToken: string = 'kv8rligig8tt0r6td03nasvzjsj8u6';
  authToken = 'q2skb2dpe9carn89wxelyb9sdcdkam';
  apiToken = '395363253cef4f97bbd402e06e76b677';

  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
  ) {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.headers = this.headers.append('Client-ID', environment.twitchClientId);
    if (this.accessToken) {
      this.headers = this.headers.append('Authorization', `Bearer ${this.accessToken}`);
    }
  }

  BuildAPIParams = (params: any[]): string => {
    return '?' +
      params.map(param => {
        if (isString(param.value)) {
          return `${param.param}=${param.value}`;
        } else if (isArray(param.value)) {
          return param.value.map(value => `${param.param}=${value}`).join('&');
        }
      }).join('&');
  }

  getFollowsPagination = () => {
    let pagePagination: string;

    this.follows$
      .pipe(
        tap(follows => console.log('tap: follows: ', follows)),
        map(follows => follows)
      )
      .subscribe(follows => {
        console.log('follows: ', follows);
        pagePagination = follows.pagination.cursor;
      });

    return pagePagination;
  }

  getUser = () => {
    const params = [
      { param: 'login', value: ['mpskeeter', 'mrbrandotv'] },
      { param: 'scope', value: 'user:read:email' },
    ];

    // let headers = this.headers.append('Client-ID', environment.twitchClientId);
    // headers = headers.append('Authorization', `Bearer ${this.accessToken}`);

    // console.log('getUser: headers: ', headers);

    this.http.get<any>(`https://api.twitch.tv/helix/users${this.BuildAPIParams(params)}`, { headers: this.headers })
      .subscribe(
        data => {
          // console.log('getUser: data: ', data.data);
          this.users.next(data.data);
        },
        // err => this.snacker.sendErrorMessage(err.error)
        err => console.log('getUser: error: ', err),
      );
  }

  acquireAppToken = (): Promise<boolean> =>
    new Promise((resolve) => {
      const params = [
        { param: 'client_id', value: environment.twitchClientId },
        { param: 'client_secret', value: environment.twitchClientSecret },
        { param: 'grant_type', value: 'client_credentials' },
        { param: 'scope', value: 'viewing_activity_read' },
        { param: 'user', value: 'mpskeeter' }
      ];

      this.http.post(`https://cors-anywhere.herokuapp.com/https://id.twitch.tv/oauth2/token${this.BuildAPIParams(params)}`, null)
        .subscribe(
          (data: TwitchAppToken) => {
            // console.log('acquireAppToken: data: ', data);
            this.accessToken = data.access_token;
            // this.snacker.sendSuccessMessage(`${asset.name} successfully created`);
            resolve(true);
          },
          err => {
            console.log('acquireAppToken: error: ', err);
            // this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    })

    getStreams = (inputParams?: {param: string, value: string[]}) => {

      console.log('inputParams: ', inputParams);
      // let userIds: string[];
      // this.follows$
      //   .pipe(
      //     // tap(follows => follows.data.map(follow => console.log('tap: follow: ', follow))),
      //     map(follows => follows.data.map(follow => follow.to_id.toString()))
      //   )
      //   .subscribe(data => userIds = data);

      const params = [
        // { param: 'user_id', value: userIds },
        { param: 'limit', value: '100' },
        inputParams,
      ];
      this.headers = this.headers.append('Accept', 'application/vnd.twitchtv.v5+json');

      this.http.get<TwitchStreams>(`https://api.twitch.tv/helix/streams${this.BuildAPIParams(params)}`, { headers: this.headers })
        .subscribe(
          data => {
            this.followedStream.next(data);
          },
          err => console.log('getFollowedStreams: error: ', err),
        );
    }

  getFollowersInitial = () => {
    const params = [
      { param: 'from_id', value: '123362174' },
      { param: 'first', value: '100' },
    ];

    this.getFollowers(params);
  }

  getFollowersPaged = () => {
    const params = [
      { param: 'from_id', value: '123362174' },
      { param: 'first', value: '20' },
      { param: 'after', value: this.getFollowsPagination() },
    ];

    this.getFollowers(params);
  }

  getFollowers = (params) => {
    this.http.get<TwitchFollows>(`https://api.twitch.tv/helix/users/follows${this.BuildAPIParams(params)}`, { headers: this.headers })
      .subscribe(
        data => {
          this.follows.next(data);
        },
        // err => this.snacker.sendErrorMessage(err.error)
        err => console.log('getFollowers: error: ', err),
      );
  }

  getAuthorize = () => {
    const params = [
      { param: 'client_id', value: environment.twitchClientId },
      { param: 'response_type', value: 'token' },
      { param: 'scope', value: 'user:read:email+analytics:read:extensions+viewing_activity_read' },
      { param: 'state', value: 'ii99ii99ii99' },
      { param: 'redirect_uri', value: environment.redirectUrl },
    ];

    // "Origin: http://127.0.0.1:3000" \
    // -H 'Access-Control-Request-Method: POST' \
    // -H 'Access-Control-Request-Headers: Content-Type, Authorization'
    // let headers = this.headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:4300');
    // headers = headers.append('Access-Control-Allow-Method', 'POST');
    // headers = headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // this.headers = this.headers.append('Client-ID', environment.twitchClientId);
    // this.headers = this.headers.append('accept', 'application/vnd.twitchtv.v5+json');


    // response.setHeader("Access-Control-Allow-Origin", "*");
    // response.setHeader("Access-Control-Allow-Credentials", "true");
    // response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    // tslint:disable-next-line: max-line-length
    // response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    // let headers = this.headers.append('Access-Control-Allow-Origin', '*');
    // let headers = this.headers.append('Access-Control-Allow-Credentials', 'true');
    // headers.append('Access-Contrl-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // tslint:disable-next-line: max-line-length
    // headers = headers.append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Request-Origin');

    // let headers = this.headers.append('Access-Control-Allow-Origin', '*');
    // headers = headers.append('Access-Control-Allow-Credentials', 'true');
    // headers = headers.append('Access-Control-Allow-Method', '*');
    // headers = headers.append('Access-Control-Allow-Headers', '*');

    console.log('getAuthorize: headers: ', this.headers);

    // this.http.get<any>(`https://cors-anywhere.herokuapp.com/https://id.twitch.tv/oauth2/authorize${this.BuildAPIParams(params)}`, { headers })
    this.http.get<any>(`https://id.twitch.tv/oauth2/authorize${this.BuildAPIParams(params)}`, { headers: this.headers })
      .subscribe(
        data => {
          console.log('authorize: data: ', data);
          // this.response.next(data);
        },
        // err => this.snacker.sendErrorMessage(err.error)
        err => console.log('authorize: error: ', err),
      );
  }
}
