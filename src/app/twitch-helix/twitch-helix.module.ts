import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from '../material.module';
import { TwitchSharedModule } from '../twitch-shared/twitch-shared.module';
import { Components } from './components';
import { Services } from './services';
import { Pipes } from './pipes';
import { TwitchHelixRoutingModule } from './twitch-helix-routing.module';
import { Directives } from './directives';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    MaterialModule,
    TwitchSharedModule,
    TwitchHelixRoutingModule,
  ],
  providers: [[...Services]],
  declarations: [[...Components], [...Pipes], [...Directives]],
  exports: [[...Components]],
})
export class TwitchHelixModule {}
