import { Component, OnInit, Input } from '@angular/core';
import { TwitchHelixApiService } from '../services';
import { map } from 'rxjs/operators';
import {
  TwitchUsersFollows,
  TwitchUsersFollowsData,
  TwitchStream,
  TwitchUser
} from '../models';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-followed-merge-live',
  templateUrl: 'twitch-helix-followed-merge-live.component.html',
})
export class TwitchHelixFollowedMergeLiveComponent implements OnInit {
  @Input() users: TwitchUser[];
  @Input() follows: TwitchUsersFollows;

  streams: any;

  constructor(
    public service: TwitchHelixApiService,
  ) { }

  async ngOnInit() {
    const userIds: string[] = this.users.map((user: TwitchUser) => user.id.toString());

    await this.service.getStreams({ param: 'user_id', value: userIds });

    this.service.followedStream$
      .pipe(
        map(streams => {
          if (this.follows !== null && streams !== null) {
            return this.users.map(user => {
              const newStream: TwitchStream = {
                id: null,
                user_id: user.id,
                user_name: user.login,
                game_id: null,
                community_ids: [null],
                type: '',
                title: null,
                viewer_count: 0,
                started_at: null,
                language: null,
                thumbnail_url: null,
                tag_ids: [null],
              };
              const streamActive = streams.data.find(stream => stream.user_id === user.id);

              return (streamActive ? streamActive : newStream);
            });
          }
        }),
      )
      .subscribe(data => this.streams = data);
  }
}
