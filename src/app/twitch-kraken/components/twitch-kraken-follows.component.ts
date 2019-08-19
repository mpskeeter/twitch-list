import { Component, OnInit } from '@angular/core';
import { TwitchKrakenApiService } from '../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-kraken-follows',
  templateUrl: 'twitch-kraken-follows.component.html',
})
export class TwitchKrakenFollowsComponent implements OnInit {
  constructor(
    public service: TwitchKrakenApiService,
  ) { }

  async ngOnInit() {
    await this.service.getUserFollows();
  }
}
