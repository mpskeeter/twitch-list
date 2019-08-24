import { Component, OnInit, Input } from '@angular/core';
import { TwitchHelixApiService } from '../services';
import { map } from 'rxjs/operators';
import { TwitchUsersFollowsData, TwitchStream, TwitchUser } from '../models';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-followed-stream',
  templateUrl: 'twitch-helix-followed-stream.component.html',
  styleUrls: ['twitch-helix-followed-stream.component.scss']
})
export class TwitchHelixFollowedStreamComponent implements OnInit {
  @Input() following: TwitchUsersFollowsData[];

  streams: any;
  users: TwitchUser[];

  constructor(public service: TwitchHelixApiService, public router: Router) {}

  async ngOnInit() {
    const userIds: string[] = this.following.map(
      (followed: TwitchUsersFollowsData) => followed.to_id
    );

    // users
    await this.service.getUsers({ param: 'id', value: userIds });
    // followedStream
    await this.service.getStreams({ param: 'user_id', value: userIds });

    combineLatest([this.service.users$, this.service.followedStream$])
      .pipe(
        map(([users, streams]) => {
          if (users && streams) {
            return users.data.map(user => {
              user.stream = streams.data.find(
                stream => stream.user_id === user.id
              );
              return user;
            });
          }
        })
      )
      .subscribe(users => (this.users = users));
  }

  isOnline = (users: TwitchUser[], online: boolean) => {
    return users.filter(
      (user: TwitchUser) =>
        (online && user.stream) || (!online && user.stream === undefined)
    );
  }

  // isOnline = (streams: TwitchStream[] , online: boolean) => {
  //   return streams.filter((stream: TwitchStream) => stream.type === (online ? 'live' : ''));
  // }

  viewStream = (userName: string) => {
    // console.log('userName: ', userName);
    this.router.navigate(['/twitch', 'viewstream', userName]);
  }
}
