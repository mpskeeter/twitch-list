import { Component, Input } from '@angular/core';

@Component({
  selector: 'twitch-helix-video',
  templateUrl: 'twitch-helix-video.component.html',
})
export class TwitchHelixVideoComponent {
  @Input() id: number;
  @Input() videoType: string;
  @Input() videoName: string;
  @Input() width: number;
  @Input() height: number;

  loadInteractiveVideo = () => {
    const script = `
      const options_${this.id} = {
        width: ${this.width},
        height: ${this.height},
        ${this.videoType}: "${this.videoName}"
      };
      var player_${this.id} = new Twitch.Player("${this.id}", options_${this.id});
      player_${this.id}.setVolume(0.5);
    `;

    return script;
  };
}
