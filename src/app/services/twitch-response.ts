export interface TwitchResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string[];
    token_type: string;
}

// {
//     "access_token": "<user access token>",
//     "refresh_token": "",
//     "expires_in": <number of seconds until the token expires>,
//     "scope": ["<your previously listed scope(s)>"],
//     "token_type": "bearer"
//   }
