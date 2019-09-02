import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  TwitchAppToken,
  TwitchUsersFollows,
  TwitchStreams,
  TwitchUsers,
  TwitchSubscriptionError,
  TwitchSubscriptionSuccess,
  TwitchClips,
} from '../models';

import { environment } from '../../../environments/environment';
import { TwitchLocalStorageService } from '../../twitch-shared/services';
import { TwitchAuthService } from '../../twitch-shared/services';

interface Parameters {
  param: string;
  value: string[] | string;
}

@Injectable({
  providedIn: 'root',
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

  private subscribed = new BehaviorSubject<TwitchSubscriptionError | TwitchSubscriptionSuccess>(null);
  subscribed$ = this.subscribed.asObservable();

  private clips = new BehaviorSubject<TwitchClips>(null);
  clips$ = this.clips.asObservable();

  private baseUrl = 'https://api.twitch.tv/';
  private headers: HttpHeaders;

  private AccessToken: string = this.storage.getAccessToken();

  constructor(private http: HttpClient, private storage: TwitchLocalStorageService, private auth: TwitchAuthService) {
    this.initializeHeaders();
  }

  checkError = (error: any) => {
    if (error.status === 401) {
      this.auth.refreshAccessToken();
      const params = this.checkError.caller.arguments;
      this.checkError.caller(params);
    } else {
      console.log(`${this.checkError.caller}: error: `, error);
    }
  };

  initializeHeaders = (apiVersion: string = 'helix') => {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.headers = this.headers.append('Client-ID', environment.twitchClientId);
    switch (apiVersion) {
      case 'helix':
        if (this.AccessToken) {
          this.headers = this.headers.append('Authorization', `Bearer ${this.AccessToken}`);
        }
        break;
      case 'kraken':
        this.headers = this.headers.append('Accept', 'application/vnd.twitchtv.v5+json');
        // if (environment.authToken) {
        //   this.headers = this.headers.append('Authorization', `OAuth ${environment.authToken}`);
        // }
        if (this.AccessToken) {
          this.headers = this.headers.append('Authorization', `OAuth ${this.AccessToken}`);
        }
        this.headers = this.headers.append('dataType', 'jsonp');
        break;
    }
  };

  BuildAPIParams = (params: any[]): string => {
    return (
      '?' +
      params
        .map((param) => {
          if (!param) {
            return '';
          } else if (typeof param.value === 'string') {
            return `${param.param}=${param.value}`;
          } else if (Array.isArray(param.value)) {
            return param.value.map((value) => `${param.param}=${value}`).join('&');
          }
        })
        .join('&')
    );
  };

  buildFullBaseUrl = (url: string, apiVersion: string = 'helix') => {
    this.initializeHeaders(apiVersion);
    return `${this.baseUrl}${apiVersion}${url}`;
  };

  buildUrl = (url: string, params: any[] = [], apiVersion: string = 'helix') => {
    return `${this.buildFullBaseUrl(url, apiVersion)}${this.BuildAPIParams(params)}`;
  };

  getFollowsPagination = () => {
    let pagePagination: string;

    this.follows$
      .pipe(
        // tap((follows) => console.log('tap: follows: ', follows)),
        map((follows) => follows),
      )
      .subscribe((follows) => (pagePagination = follows.pagination.cursor));

    return pagePagination;
  };

  getStreams = (params: Parameters | Parameters[]) => {
    const url = '/streams';

    if (!Array.isArray(params)) {
      params = [params];
    }
    params.push({ param: 'limit', value: '100' });
    const apiUrl = this.buildUrl(url, params);

    this.http
      .get<TwitchStreams>(apiUrl, { headers: this.headers })
      .subscribe((data: TwitchStreams) => this.followedStream.next(data), (err) => this.checkError(err));
  };

  getUsers = (params: Parameters | Parameters[]) => {
    const url = '/users';

    if (!Array.isArray(params)) {
      params = [params];
    }
    const apiUrl = this.buildUrl(url, params);

    this.http
      .get<TwitchUsers>(apiUrl, { headers: this.headers })
      .subscribe((data: TwitchUsers) => this.users.next(data), (err) => this.checkError(err));
  };

  getClips = (params: Parameters | Parameters[]) => {
    this.initializeHeaders();
    const url = '/clips';

    if (!Array.isArray(params)) {
      params = [params];
    }
    params.push({ param: 'limit', value: '100' });
    const apiUrl = this.buildUrl(url, params);

    this.http
      .get<TwitchClips>(apiUrl, { headers: this.headers })
      .subscribe((data) => this.clips.next(data), (err) => this.checkError(err));
  };

  getSubscription = (channelId: string) => {
    this.initializeHeaders();
    const emptyError: TwitchSubscriptionError = { error: '', message: '', status: 0 };
    const url = `/users/${this.storage.getUserId()}/subscriptions/${channelId}`;
    const apiUrl = this.buildFullBaseUrl(url, 'kraken');

    this.http.get<TwitchSubscriptionError | TwitchSubscriptionSuccess>(apiUrl, { headers: this.headers }).subscribe(
      (data) => {
        this.subscribed.next(data);
      },
      (err) => {
        if (err.status !== 404) {
          this.checkError(err);
        }
      },
    );
  };

  getUsersFollowsInitial = () => {
    const params = [{ param: 'from_id', value: this.storage.getUserId() }, { param: 'first', value: '100' }];

    this.getUsersFollows(params);
  };

  getUsersFollowsPaged = () => {
    const params: Parameters[] = [
      { param: 'from_id', value: this.storage.getUserId() },
      { param: 'first', value: '20' },
      { param: 'after', value: this.getFollowsPagination() },
    ];

    this.getUsersFollows(params);
  };

  getUsersFollows = (params: Parameters[]) => {
    const url = '/users/follows';
    const apiUrl = this.buildUrl(url, params);
    this.http
      .get<TwitchUsersFollows>(apiUrl, { headers: this.headers })
      .subscribe((data) => this.follows.next(data), (err) => this.checkError(err));
  };
}
