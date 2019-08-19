import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { TwitchComponents } from './components';
import { Services } from '../services';
import { Pipes } from './pipes';
import { TwitchHelixRoutingModule } from './twitch-helix-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    TwitchHelixRoutingModule,
  ],
  providers: [
    [...Services]
  ],
  declarations: [
    [...TwitchComponents],
    [...Pipes],
  ],
  exports:      [
    [...TwitchComponents]
  ],
})
export class TwitchHelixModule { }
