import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { TwitchSharedModule } from '../twitch-shared/twitch-shared.module';
import { Services } from './services';
// import { Components } from './components';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, TwitchSharedModule],
  providers: [[...Services]],
  exports: [],
})
export class TwitchAuthModule {}
