import { Component, OnInit, OnDestroy } from '@angular/core';
import { TwitchHelixApiService } from '../services';
// import { DynamicScriptLoaderService } from '../services';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, combineLatest, BehaviorSubject } from 'rxjs';
import { TwitchUser } from '../models';
import { map } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-view-stream',
  templateUrl: 'twitch-helix-view-stream.component.html',
  styleUrls: ['./twitch-helix-view-stream.component.scss'],
})
export class TwitchHelixViewStreamComponent implements OnInit, OnDestroy {
  streamName: string[] | string;
  routeSub: Subscription;

  // users: TwitchUser[];

  users = new BehaviorSubject<TwitchUser[]>(null);
  users$ = this.users.asObservable();

  width = 400;
  height = 400;

  constructor(
    public service: TwitchHelixApiService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    // this.scriptLoader.loadScript('twitch-embed');
  }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(async (param: ParamMap) => {
      if (param.has('id')) {
        this.streamName = param.get('id').split(',');
        // this.streamId = Number.parseInt(param.get('id'), 10);
        // await this.service.getStreams({ param: 'user_login', value: this.streamName });

        console.log('streamName: ', this.streamName);

        // // users
        await this.service.getUsers({ param: 'login', value: this.streamName });
        // // followedStream
        await this.service.getStreams({
          param: 'user_login',
          value: this.streamName,
        });

        combineLatest([this.service.users$, this.service.followedStream$])
          .pipe(
            map(([users, streams]) => {
              if (users && streams) {
                return users.data.map((user) => {
                  user.stream = streams.data.find(
                    (stream) => stream.user_id === user.id,
                  );
                  return user;
                });
              }
            }),
          )
          .subscribe((users) => this.users.next(users));
      } else {
        console.log('error');
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
