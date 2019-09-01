import { Component, Input, OnInit } from '@angular/core';
import { TwitchUser, TwitchClip, TwitchClips } from '../models';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-stream',
  templateUrl: 'twitch-helix-stream.component.html',
  styleUrls: ['twitch-helix-stream.component.scss'],
})
export class TwitchHelixStreamComponent implements OnInit {
  @Input() input: TwitchUser | TwitchClip;
  @Input() height = 400;
  @Input() width = 400;

  user: TwitchUser;
  clip: TwitchClip;
  videoType: string;
  videoName: string;

  collapsed = false;
  interactive = true;

  toggleCollapsed = () => (this.collapsed = !this.collapsed);

  ngOnInit() {
    const user: TwitchUser = this.input as TwitchUser;
    const clip: TwitchClip = this.input as TwitchClip;

    console.log('clip: ', clip);

    switch (true) {
      case user.login !== undefined:
        this.user = user;
        this.videoType = 'channel';
        this.videoName = user.stream.user_name;
        break;

      case clip.url !== undefined:
        this.clip = clip;
        this.videoType = 'video';
        this.videoName = clip.id;
        break;
    }
  }

  loadInteractiveVideo = () => {
    let script: string;
    let id: string;
    let type: string;
    switch (true) {
      case this.user.login !== undefined:
        // const user: TwitchUser = this.input as TwitchUser;
        id = this.user.stream.id;
        type = `  channel: "${this.user.stream.user_name}"`;
        break;

      case this.clip.url !== undefined:
        // const clip: TwitchClip = this.input as TwitchClip;
        id = this.clip.id;
        type = `  video: "${this.clip.id}"`;
        break;
    }

    script = `
const options_${id} = {
  width: ${this.width},
  height: ${this.height},
${type}
};
var player_${id} = new Twitch.Player("${id}", options_${id});
player_${id}.setVolume(0.5);
    `;

    console.log('script: ', script);
    return script;
  };

  loadNonInteractiveVideo = () => {
    const script = `
      <iframe
          src="https://player.twitch.tv/?${this.user.stream.user_name}"
          height="${this.height}"
          width="${this.width}"
          frameborder="0"
          scrolling="no"
          allowfullscreen="true">
      </iframe>
    `;

    return script;
  };
}
