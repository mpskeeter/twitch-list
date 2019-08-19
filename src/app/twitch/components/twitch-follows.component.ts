import { Component, OnInit } from '@angular/core';
import { TwitchApiService } from '../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-follows',
  templateUrl: 'twitch-follows.component.html',
})
export class TwitchFollowsComponent implements OnInit {
  constructor(
    public service: TwitchApiService,
  ) { }

  async ngOnInit() {
    await this.service.getFollowersInitial();
  }
}
