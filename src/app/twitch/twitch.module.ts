import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { TwitchComponents } from './components';
import { Services } from '../services';
import { TwitchRoutingModule } from './twitch-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    TwitchRoutingModule,
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
export class TwitchModule { }
