import { Component, OnInit, Input } from '@angular/core';
import { TwitchHelixApiService } from '../services';
import { map } from 'rxjs/operators';
import { TwitchUsersFollows, TwitchUsersFollowsData, TwitchStream } from '../models';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-followed-stream',
  templateUrl: 'twitch-helix-followed-stream.component.html',
})
export class TwitchHelixFollowedStreamComponent implements OnInit {
  @Input() follows: TwitchUsersFollows;

  streams: any;

  constructor(
    public service: TwitchHelixApiService,
  ) { }

  async ngOnInit() {
    const userIds: string[] = this.follows.data.map((followed: TwitchUsersFollowsData) => followed.to_id.toString());

    await this.service.getStreams({ param: 'user_id', value: userIds });

    this.service.followedStream$
      .pipe(
        map(streams => {
          if (this.follows !== null && streams !== null) {
            return this.follows.data.map(follow => {
              const newStream: TwitchStream = {
                id: null,
                user_id: follow.to_id,
                user_name: follow.to_name,
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
              const streamActive = streams.data.find(stream => stream.user_id === follow.to_id);

              return (streamActive ? streamActive : newStream);
            });
          }
        }),
      )
      .subscribe(data => this.streams = data);
  }
}
