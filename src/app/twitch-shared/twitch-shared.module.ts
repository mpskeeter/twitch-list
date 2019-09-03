import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { Services } from './services';
import { Guards } from './guards';
import { Components } from './components';
import { Pipes } from './pipes';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [[...Components], [...Pipes]],
  imports: [CommonModule, RouterModule, MaterialModule, NgxLocalStorageModule.forRoot()],
  exports: [[...Components]],
  providers: [[...Services], [...Guards]],
})
export class TwitchSharedModule {}
