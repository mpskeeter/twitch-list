import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';

import { TwitchLocalStorageService } from './twitch-local-storage.service';
import { TwitchBaseService, Parameter } from './twitch-base.service';

import { environment } from '../../../environments/environment';

interface BearerResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
}

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  scope: string[];
}

interface RefreshError {
  error: string;
  status: number;
  message: string;
}

interface ValidateReponse {
  client_id: string;
  login: string;
  scopes: string[];
  user_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class TwitchAuthService extends TwitchBaseService {
  private baseUrl = 'https://id.twitch.tv/oauth2';

  private state: string =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);

  constructor(public http: HttpClient, public storage: TwitchLocalStorageService) {
    super(http, storage);
  }

  buildUrl = (url: string, params: any[] = []) => {
    let urlParams = '';
    if (params !== ([] || '')) {
      urlParams = this.BuildAPIParams(params);
    }
    return `${this.baseUrl}${url}${urlParams}`;
  };

  loginUrl = (responseType: string = 'code'): string => {
    let state = this.storage.getOriginalState();

    if (!state) {
      state = this.state;
      this.storage.setOriginalState(state);
    }

    const params: Parameter[] = [
      { param: 'client_id', value: environment.twitchClientId },
      { param: 'redirect_uri', value: environment.redirectUrl + '/callback' },
      { param: 'response_type', value: responseType },
      { param: 'scope', value: 'user_read user:read:email clips:edit chat:read chat:edit' },
      { param: 'state', value: state },
    ];

    return this.buildUrl('/authorize', params);
  };

  logout = () => {
    this.user.next(null);
    this.storage.logout();
  }

  acquireAccessToken = (state: string, token: string): Promise<boolean> =>
    new Promise((resolve) => {
      const originalState = this.storage.getOriginalState();

      if (state === originalState) {
        const params = [
          { param: 'client_id', value: environment.twitchClientId },
          { param: 'client_secret', value: environment.twitchClientSecret },
          { param: 'code', value: token },
          { param: 'grant_type', value: 'authorization_code' },
          { param: 'redirect_uri', value: environment.redirectUrl + '/callback' },
        ];

        const url = this.buildUrl('/token', params);

        const body = {
          client_id: environment.twitchClientId,
          client_secret: environment.twitchClientSecret,
          code: token,
          grant_type: 'authorization_code',
          redirect_uri: environment.redirectUrl + '/callback',
        };

        this.http
          .post<BearerResponse>(url, body)
          .pipe(
            tap((data: BearerResponse) => {
              this.storage.setAccessToken(data.access_token);
              this.storage.setRefreshToken(data.refresh_token);
              this.storage.setExpiresIn(data.expires_in);
              this.storage.setAcquireTime();
              this.storage.deleteOriginalState();
            }),
            switchMap(() => this.validateAccessToken()),
          )
          .subscribe(
            (data) => resolve(data),
            (err) => {
              console.log('acquireAccessToken: error: ', err);
              resolve(false);
            },
          );
      } else {
        resolve(false);
      }
    });

  refreshAccessToken = (): Promise<boolean> =>
    new Promise((resolve) => {
      const refreshToken = this.storage.getRefreshToken();

      const params = [
        { param: 'grant_type', value: 'refresh_token' },
        { param: 'refresh_token', value: refreshToken },
        { param: 'client_id', value: environment.twitchClientId },
        { param: 'client_secret', value: environment.twitchClientSecret },
      ];

      const url = this.buildUrl('/token', params);

      const body = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: environment.twitchClientId,
        client_secret: environment.twitchClientSecret,
      };

      this.http
        .post<RefreshResponse | RefreshError>(url, body)
        .pipe(
          tap((data: RefreshResponse) => {
            this.storage.setAccessToken(data.access_token);
            this.storage.setRefreshToken(data.refresh_token);
            this.storage.setAcquireTime();
            this.storage.deleteExpiresIn();
          }),
        )
        .subscribe(
          () => resolve(true),
          (err) => {
            console.log('refreshAccessToken: error: ', err);
            resolve(false);
          },
        );
    });

  validateAccessToken = (): Promise<boolean> =>
    new Promise((resolve) => {
      const token = this.storage.getAccessToken();

      const url = this.buildUrl('/validate', []);

      this.http
        .get<ValidateReponse>(url, { headers: new HttpHeaders().set('Authorization', `OAuth ${token}`) })
        .pipe(tap((data: ValidateReponse) => this.storage.setUserId(data.user_id)))
        .subscribe(
          () => resolve(true),
          (err) => {
            console.log('validateAccessToken: error: ', err);
            resolve(false);
          },
        );
    });
}
