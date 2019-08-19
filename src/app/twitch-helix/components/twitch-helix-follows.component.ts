import { Component, OnInit } from '@angular/core';
import { TwitchHelixApiService } from '../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-follows',
  templateUrl: 'twitch-helix-follows.component.html',
})
export class TwitchHelixFollowsComponent implements OnInit {
  constructor(
    public service: TwitchHelixApiService,
  ) { }

  async ngOnInit() {
    await this.service.getUsersFollowsInitial();
  }
}
