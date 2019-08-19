import { Component, OnInit, Input } from '@angular/core';
import { TwitchHelixApiService } from '../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-followed-get-users',
  templateUrl: 'twitch-helix-followed-get-users.component.html',
})
export class TwitchHelixFollowedGetUsersComponent implements OnInit {
  @Input() userIds: string[];

  constructor(
    public service: TwitchHelixApiService,
  ) { }

  async ngOnInit() {
    await this.service.getUsers(this.userIds);
  }
}
