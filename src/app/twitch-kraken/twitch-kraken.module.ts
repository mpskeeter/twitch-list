import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { TwitchComponents } from './components';
import { Services } from '../services';
import { TwitchKrakenRoutingModule } from './twitch-kraken-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    TwitchKrakenRoutingModule,
  ],
  providers: [
    [...Services]
  ],
  declarations: [
    [...TwitchComponents]
  ],
  exports:      [
    [...TwitchComponents]
  ],
})
export class TwitchKrakenModule { }
