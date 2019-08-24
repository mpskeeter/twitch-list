import { Component, Input } from '@angular/core';
import { TwitchUser } from '../models';
// import { DynamicScriptLoaderService } from '../services';

// declare const Twitch: any;
// import 'twitch-embed';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-stream',
  templateUrl: 'twitch-helix-stream.component.html',
  styleUrls: ['twitch-helix-stream.component.scss']
})
export class TwitchHelixStreamComponent {
  @Input() user: TwitchUser;

  // constructor(
  //   public scriptLoader: DynamicScriptLoaderService,
  // ) {
  //   this.scriptLoader.loadScript('twitch-embed');
  // }

  loadVideo = () => {
    const script = `
    const options_${this.user.stream.id} = {
    width: 300,
    height: 300,
    channel: "${this.user.stream.user_name}"
  };
  var player_${this.user.stream.id} = new Twitch.Player("${this.user.stream.id}", options_${this.user.stream.id});
  player_${this.user.stream.id}.setVolume(0.5);
    `;

    return script;
  }
}
