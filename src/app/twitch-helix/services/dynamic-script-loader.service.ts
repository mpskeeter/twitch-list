import { Injectable } from '@angular/core';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';

interface Scripts {
  name: string;
  src: string;
  action: string;
}

export const ScriptStore: Scripts[] = [
  {
    name: 'twitch-embed',
    src: 'https://player.twitch.tv/js/embed/v1.js',
    action: 'onload="loadPlayer()"'
  }
];

declare var document: any;

interface ResultInterface {
  script: string;
  loaded: boolean;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class DynamicScriptLoaderService {
  private scripts: any = {};

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src,
        action: script.action
      };
    });
  }

  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach(script => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    let status = 'Not Loaded';
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        // load script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {
          // IE
          script.onreadystatechange = () => {
            if (
              script.readyState === 'loaded' ||
              script.readyState === 'complete'
            ) {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              status = 'Loaded';
            } else {
              status = script.readyState;
            }
          };
        } else {
          // Others
          script.onload = () => {
            this.scripts[name].loaded = true;
            status = 'Loaded';
          };
        }
        script.onerror = (error: any) => {
          status = error;
        };

        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        status = 'Already Loaded';
      }
      resolve({ script: name, loaded: this.scripts[name].loaded, status });
    });
  }
}
