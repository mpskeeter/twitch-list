import { Component, OnInit, OnDestroy } from '@angular/core';
import { TwitchHelixApiService, TwitchKrakenApiService } from '../services';
// import { DynamicScriptLoaderService } from '../services';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, combineLatest, BehaviorSubject } from 'rxjs';
import { TwitchUser } from '../models';
import { map } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-user-clips',
  templateUrl: 'twitch-helix-user-clips.component.html',
  styleUrls: ['./twitch-helix-user-clips.component.scss'],
  providers: [TwitchKrakenApiService],
})
export class TwitchHelixUserClipsComponent implements OnInit, OnDestroy {
  userId: string[] | string;
  routeSub: Subscription;

  // users: TwitchUser[];

  users = new BehaviorSubject<TwitchUser[]>(null);
  users$ = this.users.asObservable();

  width = 400;
  height = 400;

  constructor(
    public serviceHelix: TwitchHelixApiService,
    public serviceKraken: TwitchKrakenApiService,
    public router: Router,
    public route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(async (param: ParamMap) => {
      if (param.has('id')) {
        // this.streamName = param.get('id').split(',');
        this.userId = param.get('id');
        console.log('streamName: ', this.userId);

        // users
        await this.serviceHelix.getUsers({ param: 'id', value: this.userId });
        // followedStream
        await this.serviceHelix.getStreams({ param: 'user_id', value: this.userId });
        // clips
        // await this.serviceKraken.getClips({ param: 'broadcaster_id', value: this.userId });
        // // subscribed
        // await this.serviceKraken.getSubscription(this.userId);

        combineLatest([
          this.serviceHelix.users$,
          this.serviceHelix.followedStream$,
          // this.serviceKraken.subscribed$,
          // this.serviceKraken.clips$,
        ])
          .pipe(
            map(([users, streams]) => {
              // , clips, subscribed,
              if (users && streams) {
                return users.data.map((user) => {
                  user.stream = streams.data.find((stream) => stream.user_id === user.id);
                  // user.subscription = subscribed;
                  // user.clips = clips.data.filter((clip) => clip.broadcaster_id === user.id);
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

  viewClips = (id: string) => {
    this.router.navigate(['/twitch', 'viewclips', id]);
  };
}
