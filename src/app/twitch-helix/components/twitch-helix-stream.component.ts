import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { TwitchUser } from '../models';
import { TwitchHelixVideoComponent } from './twitch-helix-video.component';
// import { DynamicScriptLoaderService } from '../services';

// declare const Twitch: any;
// import 'twitch-embed';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-stream',
  templateUrl: 'twitch-helix-stream.component.html',
  styleUrls: ['twitch-helix-stream.component.scss'],
})
export class TwitchHelixStreamComponent {
  // @ViewChild('video', {static: true, read: ElementRef}) video: ElementRef;

  @Input() user: TwitchUser;
  @Input() height: number;
  @Input() width: number;

  collapsed = false;

  interactive = true;

  toggleCollapsed = () => (this.collapsed = !this.collapsed);

  // constructor(
  //   public scriptLoader: DynamicScriptLoaderService,
  // ) {
  //   this.scriptLoader.loadScript('twitch-embed');
  // }

  // ngAfterViewInit() {
  //   console.log('nativeElement: ', this.video.nativeElement);
  //   // this.video.nativeElement = `
  //   // <div id="${ this.user.stream.id }" gdAlignColumns="center center"></div>
  //   // <script-hack>${ this.loadInteractiveVideo() }</script-hack>
  //   // `;
  // }

  loadInteractiveVideo = () => {
    const script = `
    const options_${this.user.stream.id} = {
    width: ${this.width},
    height: ${this.height},
    channel: "${this.user.stream.user_name}"
  };
  var player_${this.user.stream.id} = new Twitch.Player("${this.user.stream.id}", options_${this.user.stream.id});
  player_${this.user.stream.id}.setVolume(0.5);
    `;

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
