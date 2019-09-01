import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { TwitchLocalStorageService } from './twitch-local-storage.service';

interface Parameters {
  param: string;
  value: string[] | string;
}

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
export class TwitchAuthService {
  private baseUrl = 'https://id.twitch.tv/oauth2';

  private headers: HttpHeaders;

  private state: string =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);

  constructor(private http: HttpClient, private localStorage: TwitchLocalStorageService) {}

  initializeHeaders = () => {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.headers = this.headers.append('Client-ID', environment.twitchClientId);
    this.headers = this.headers.append('Accept', 'application/vnd.twitchtv.v5+json');
    this.headers = this.headers.append('dataType', 'jsonp');
  };

  BuildAPIParams = (params: any[]): string => {
    console.log('BuildAPIParams: params: ', params);

    if (params === ([] || '')) {
      return '';
    }

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

    if (retValue !== '') {
      retValue = '?' + retValue;
    }

    return retValue;
  };

  buildUrl = (url: string, params: any[] = []) => {
    let urlParams = '';
    if (params !== ([] || '')) {
      urlParams = this.BuildAPIParams(params);
    }
    return `${this.baseUrl}${url}${urlParams}`;
  };

  authorizeUrl = (responseType: string = 'code'): string => {
    let state = this.localStorage.getOriginalState();

    if (!state) {
      state = this.state;
      this.localStorage.setOriginalState(state);
    }

    const params = [
      { param: 'client_id', value: environment.twitchClientId },
      { param: 'redirect_uri', value: environment.redirectUrl + '/callback' },
      { param: 'response_type', value: responseType },
      { param: 'scope', value: 'user_read user:read:email clips:edit chat:read chat:edit' },
      { param: 'state', value: state },
    ];

    return this.buildUrl('/authorize', params);
  };

  login = () => {
    this.initializeHeaders();

    this.http
      .get<any>(this.authorizeUrl('token'), { headers: this.headers })
      .subscribe(
        (data: any) => console.log('acquireAppToken: data: ', data),
        (err) => console.log('acquireAppToken: error: ', err),
      );
  };

  acquireAccessToken = (state: string, token: string): Promise<boolean> =>
    new Promise((resolve) => {
      const originalState = this.localStorage.getOriginalState();

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

        console.log('body: ', body);

        this.http.post<BearerResponse>(url, body).subscribe(
          (data: BearerResponse) => {
            this.localStorage.setAccessToken(data.access_token);
            this.localStorage.setRefreshToken(data.refresh_token);
            this.localStorage.setExpiresIn(data.expires_in);
            this.localStorage.deleteOriginalState();
            this.validateAccessToken();
            resolve(true);
          },
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
      const refreshToken = this.localStorage.getRefreshToken();

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

      console.log('body: ', body);

      this.http.post<RefreshResponse | RefreshError>(url, body).subscribe(
        (data: RefreshResponse) => {
          this.localStorage.setAccessToken(data.access_token);
          this.localStorage.setRefreshToken(data.refresh_token);
          resolve(true);
        },
        (err) => {
          console.log('refreshAccessToken: error: ', err);
          resolve(false);
        },
      );
    });

  validateAccessToken = (): Promise<boolean> =>
    new Promise((resolve) => {
      const token = this.localStorage.getAccessToken();

      const url = this.buildUrl('/validate', []);
      this.initializeHeaders();

      this.headers = new HttpHeaders().set('Authorization', `OAuth ${token}`);

      this.http.get<ValidateReponse>(url, { headers: this.headers }).subscribe(
        (data: ValidateReponse) => {
          this.localStorage.setUserId(data.user_id);
          resolve(true);
        },
        (err) => {
          console.log('validateAccessToken: error: ', err);
          resolve(false);
        },
      );
    });
}
