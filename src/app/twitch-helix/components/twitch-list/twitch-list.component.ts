import { Component, OnInit } from '@angular/core';
import { TwitchHelixApiService } from '../../services';
import { TwitchLocalStorageService } from '../../../twitch-shared/services';
import { TwitchUser } from '../../models';

@Component({
  selector: 'twitch-list',
  templateUrl: './twitch-list.component.html',
  styleUrls: ['./twitch-list.component.scss']
})
export class TwitchListComponent implements OnInit {

  constructor(
    public service: TwitchHelixApiService,
    public storage: TwitchLocalStorageService,
  ) { }

  ngOnInit() {
    this.service.getChannels();
  }

  isOnline = (users: TwitchUser[], online: boolean) => {
    return users.filter(
      (user: TwitchUser) => (online && user.stream) || (!online && user.stream === undefined)
    );
  };
}
