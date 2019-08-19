import { Component, OnInit } from '@angular/core';
import { TwitchHelixApiService } from '../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-users-follows',
  templateUrl: 'twitch-helix-users-follows.component.html',
})
export class TwitchHelixUsersFollowsComponent implements OnInit {
  constructor(
    public service: TwitchHelixApiService,
  ) { }

  async ngOnInit() {
    await this.service.getUsersFollowsInitial();
  }
}
