import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MyPlayerComponent } from './my-player/my-player.component';


@NgModule({
  declarations: [
    MyPlayerComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    MyPlayerComponent
  ]

})
export class AudioModule { }
