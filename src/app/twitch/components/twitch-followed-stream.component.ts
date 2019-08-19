import { Component, OnInit, Input } from '@angular/core';
import { TwitchApiService } from '../services';
import { TwitchFollows } from '../models/twitch-follows';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { TwitchFollowsDataInterface, TwitchStream } from '../models';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-followed-stream',
  templateUrl: 'twitch-followed-stream.component.html',
})
export class TwitchFollowedStreamComponent implements OnInit {
  @Input() follows: TwitchFollows;

  streams: any;

  constructor(
    public service: TwitchApiService,
  ) { }

  async ngOnInit() {
    const userIds: string[] = this.follows.data.map((followed: TwitchFollowsDataInterface) => followed.to_id.toString());

    console.log('userIds: ', userIds);

    await this.service.getStreams({ param: 'user_id', value: userIds });

    this.service.followedStream$
      .pipe(
        map(streams => {
          if (this.follows !== null && streams !== null) {
            return this.follows.data.map(follow => {
              const newStream: TwitchStream = {
                game_id: null,
                id: null,
                language: null,
                started_at: null,
                tag_ids: [null],
                thumbnail_url: null,
                title: null,
                type: '',
                user_id: follow.to_id,
                user_name: follow.to_name,
                viewer_count: 0,
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
