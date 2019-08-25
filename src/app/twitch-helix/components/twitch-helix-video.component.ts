import { Component, Input } from '@angular/core';

@Component({
  selector: 'twitch-helix-video',
  templateUrl: 'twitch-helix-video.component.html',
})
export class TwitchHelixVideoComponent {
  @Input() id: number;
  @Input() width: number;
  @Input() height: number;
  @Input() userName: string;

  loadInteractiveVideo = () => {
    const script = `
      const options_${this.id} = {
        width: ${this.width},
        height: ${this.height},
        channel: "${this.userName}"
      };
      var player_${this.id} = new Twitch.Player("${this.id}", options_${this.id});
      player_${this.id}.setVolume(0.5);
    `;

    return script;
  };
}
