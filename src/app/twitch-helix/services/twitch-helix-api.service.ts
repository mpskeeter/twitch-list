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

import { TwitchLocalStorageService } from '../../twitch-shared/services';
import { TwitchBaseService, TwitchAuthService, Parameter } from '../../twitch-shared/services';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TwitchHelixApiService extends TwitchBaseService {
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

  constructor(
    public http: HttpClient,
    public storage: TwitchLocalStorageService,
    private auth: TwitchAuthService
  ) {
    super(http, storage);
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
    super.initializeHeaders();
    if (apiVersion === 'helix') {
      this.headers = this.headers.delete('Accept');
      this.headers = this.headers.delete('dataType');
    }
    if (this.AccessToken) {
      this.headers = this.headers.append('Authorization', `${apiVersion === 'helix' ? 'Bearer' : 'OAuth'} ${this.AccessToken}`);
    }
  };

  buildFullBaseUrl = (url: string, apiVersion: string = 'helix') => {
    this.initializeHeaders(apiVersion);
    return `${this.baseUrl}${apiVersion}${url}`;
  };

  buildUrl = (url: string, params: any[] | null = [], apiVersion: string = 'helix') => {
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

  getStreams = (params: Parameter | Parameter[]) => {
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

  getUsers = (params: Parameter | Parameter[] | null) => {
    const url = '/users';

    if (!Array.isArray(params)) {
      params = [params];
    }
    const apiUrl = this.buildUrl(url, params);

    this.http
      .get<TwitchUsers>(apiUrl, { headers: this.headers })
      .subscribe((data: TwitchUsers) => this.users.next(data), (err) => this.checkError(err));
  };

  getClips = (params: Parameter | Parameter[]) => {
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
    const params: Parameter[] = [
      { param: 'from_id', value: this.storage.getUserId() },
      { param: 'first', value: '20' },
      { param: 'after', value: this.getFollowsPagination() },
    ];

    this.getUsersFollows(params);
  };

  getUsersFollows = (params: Parameter[]) => {
    const url = '/users/follows';
    const apiUrl = this.buildUrl(url, params);
    this.http
      .get<TwitchUsersFollows>(apiUrl, { headers: this.headers })
      .subscribe((data) => this.follows.next(data), (err) => this.checkError(err));
  };
}
