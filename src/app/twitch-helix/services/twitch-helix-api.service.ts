import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import {
  TwitchAppToken,
  TwitchUsersFollows,
  TwitchStreams,
  TwitchUsers,
  TwitchSubscriptionError,
  TwitchSubscriptionSuccess
} from '../models';

import { environment } from '../../../environments/environment';

interface Parameters {
  param: string;
  value: string[] | string;
}

@Injectable({
  providedIn: 'root'
})
export class TwitchHelixApiService {
  private appToken = new BehaviorSubject<TwitchAppToken>(null);
  appToken$ = this.appToken.asObservable();

  private users = new BehaviorSubject<TwitchUsers>(null);
  users$ = this.users.asObservable();

  private follows = new BehaviorSubject<TwitchUsersFollows>(null);
  follows$ = this.follows.asObservable();

  private followedStream = new BehaviorSubject<TwitchStreams>(null);
  followedStream$ = this.followedStream.asObservable();

  private subscribed = new BehaviorSubject<
    TwitchSubscriptionError | TwitchSubscriptionSuccess
  >(null);
  subscribed$ = this.subscribed.asObservable();

  private baseUrl = 'https://api.twitch.tv/';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.initializeHeaders();
  }

  initializeHeaders = (apiVersion: string = 'helix') => {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.headers = this.headers.append('Client-ID', environment.twitchClientId);
    switch (apiVersion) {
      case 'helix':
        if (environment.accessToken) {
          this.headers = this.headers.append(
            'Authorization',
            `Bearer ${environment.accessToken}`
          );
        }
        break;
      case 'kraken':
        this.headers = this.headers.append(
          'Accept',
          'application/vnd.twitchtv.v5+json'
        );
        if (environment.authToken) {
          this.headers = this.headers.append(
            'Authorization',
            `OAuth ${environment.authToken}`
          );
        }
        this.headers = this.headers.append('dataType', 'jsonp');
        break;
    }
  }

  BuildAPIParams = (params: any[]): string => {
    return (
      '?' +
      params
        .map(param => {
          if (!param) {
            return '';
          } else if (typeof param.value === 'string') {
            return `${param.param}=${param.value}`;
          } else if (Array.isArray(param.value)) {
            return param.value
              .map(value => `${param.param}=${value}`)
              .join('&');
          }
        })
        .join('&')
    );
  }

  buildFullBaseUrl = (url: string, apiVersion: string = 'helix') => {
    this.initializeHeaders(apiVersion);
    return `${this.baseUrl}${apiVersion}${url}`;
  }

  buildUrl = (
    url: string,
    params: any[] = [],
    apiVersion: string = 'helix'
  ) => {
    return `${this.buildFullBaseUrl(url, apiVersion)}${this.BuildAPIParams(
      params
    )}`;
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
    const url = '/users';
    const params = [
      { param: 'login', value: ['mpskeeter', 'mrbrandotv'] },
      { param: 'scope', value: 'user:read:email' }
    ];

    const apiUrl = this.buildUrl(url, params);

    // this.http.get<any>(`https://api.twitch.tv/helix/users${this.BuildAPIParams(params)}`, { headers: this.headers })
    this.http.get<any>(apiUrl, { headers: this.headers }).subscribe(
      data => {
        // console.log('getUser: data: ', data.data);
        this.users.next(data.data);
      },
      // err => this.snacker.sendErrorMessage(err.error)
      err => console.log('getUser: error: ', err)
    );
  }

  acquireAppToken = (): Promise<boolean> =>
    new Promise(resolve => {
      const params = [
        { param: 'client_id', value: environment.twitchClientId },
        { param: 'client_secret', value: environment.twitchClientSecret },
        { param: 'grant_type', value: 'client_credentials' },
        { param: 'scope', value: 'viewing_activity_read' },
        { param: 'user', value: 'mpskeeter' }
      ];

      this.http
        .post(
          `https://cors-anywhere.herokuapp.com/https://id.twitch.tv/oauth2/token${this.BuildAPIParams(
            params
          )}`,
          null
        )
        .subscribe(
          (data: TwitchAppToken) => {
            // console.log('acquireAppToken: data: ', data);
            environment.accessToken = data.access_token;
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

  getStreams = (inputParams: Parameters | Parameters[]) => {
    const url = '/streams';

    if (!Array.isArray(inputParams)) {
      inputParams = [inputParams];
    }

    inputParams.push({ param: 'limit', value: '100' });

    const apiUrl = this.buildUrl(url, inputParams);
    // this.headers = this.headers.append('Accept', 'application/vnd.twitchtv.v5+json');

    this.http.get<TwitchStreams>(apiUrl, { headers: this.headers }).subscribe(
      data => {
        this.followedStream.next(data);
      },
      err => console.log('getFollowedStreams: error: ', err)
    );
  }

  getUsers = (params: Parameters | Parameters[]) => {
    const url = '/users';

    if (!Array.isArray(params)) {
      params = [params];
    }
    const apiUrl = this.buildUrl(url, params);

    this.http.get<TwitchUsers>(apiUrl, { headers: this.headers }).subscribe(
      (data: TwitchUsers) => {
        // console.log('getUsers: data: ', data);
        this.users.next(data);
      },
      // err => this.snacker.sendErrorMessage(err.error)
      err => console.log('getUser: error: ', err)
    );
  }

  getSubscription = (channelId: string) => {
    this.initializeHeaders();

    const url = `/users/${environment.userId}/subscriptions/${channelId}`;

    const apiUrl = this.buildFullBaseUrl(url, 'kraken');
    // this.headers = this.headers.append('Accept', 'application/vnd.twitchtv.v5+json');

    // console.log('headers: ', this.headers);

    this.http
      .get<TwitchSubscriptionError | TwitchSubscriptionSuccess>(
        // (`https://cors-anywhere.herokuapp.com/${apiUrl}`, { headers: this.headers })
        apiUrl,
        { headers: this.headers }
      )
      .subscribe(
        data => {
          console.log('getSubscription: data: ', data);
          // if (data instanceof TwitchSubscriptionSuccess) {
          //   this.subscription.next(data);
          // }
          this.subscribed.next(data);
        },
        err => {}
        // err => this.snacker.sendErrorMessage(err.error)
        // err => console.log('getSubscription: error: ', err),
      );
  }

  // https://api.twitch.tv/kraken/users/<user ID>/subscriptions/<channel ID>

  getUsersFollowsInitial = () => {
    const params = [
      { param: 'from_id', value: environment.userId.toString() },
      { param: 'first', value: '100' }
    ];

    this.getUsersFollows(params);
  }

  getUsersFollowsPaged = () => {
    const params = [
      { param: 'from_id', value: environment.userId.toString() },
      { param: 'first', value: '20' },
      { param: 'after', value: this.getFollowsPagination() }
    ];

    this.getUsersFollows(params);
  }

  getUsersFollows = params => {
    const url = '/users/follows';
    const apiUrl = this.buildUrl(url, params);
    this.http
      .get<TwitchUsersFollows>(apiUrl, { headers: this.headers })
      .subscribe(
        data => {
          this.follows.next(data);
        },
        // err => this.snacker.sendErrorMessage(err.error)
        err => console.log('getFollowers: error: ', err)
      );
  }

  getAuthorize = () => {
    const params = [
      { param: 'client_id', value: environment.twitchClientId },
      { param: 'response_type', value: 'token' },
      {
        param: 'scope',
        value: 'user:read:email+analytics:read:extensions+viewing_activity_read'
      },
      { param: 'state', value: 'ii99ii99ii99' },
      { param: 'redirect_uri', value: environment.redirectUrl }
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

    this.http
      .get<any>(
        `https://id.twitch.tv/oauth2/authorize${this.BuildAPIParams(params)}`,
        { headers: this.headers }
      )
      .subscribe(
        data => {
          console.log('authorize: data: ', data);
          // this.response.next(data);
        },
        // err => this.snacker.sendErrorMessage(err.error)
        err => console.log('authorize: error: ', err)
      );
  }
}
