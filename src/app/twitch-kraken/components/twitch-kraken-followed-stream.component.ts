import { Component, Input, OnInit } from '@angular/core';
import { TwitchKrakenApiService } from '../services';
import { TwitchUserFollows } from '../models';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-kraken-followed-stream',
  templateUrl: 'twitch-kraken-followed-stream.component.html',
})
export class TwitchKrakenFollowedStreamComponent implements OnInit {
  @Input() follows: TwitchUserFollows[];

  streams: any;

  constructor(
    public service: TwitchKrakenApiService,
  ) { }

  async ngOnInit() {
    console.log('follows: ', this.follows);
    const userIds = this.follows.map(follow => follow.channel._id.toString());
    console.log('userIds: ', userIds);

    // await this.service.getStreamByUser();
    await this.service.getStreamByUser();
    console.log('LiveStreams: ', this.service.liveStreams$);

    // await this.service.getUserNameToId({param: 'login', value: userIds});
    // console.log('userNameToId: ', this.service.userNameToId$);
  }
}
