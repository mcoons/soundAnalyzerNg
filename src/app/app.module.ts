import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { Canvas2DComponent } from './canvas2-d/canvas2-d.component';
import { Canvas3DComponent } from './canvas3-d/canvas3-d.component';
import { OptionsPanelComponent } from './options-panel/options-panel.component';
import { ConsoleComponent } from './console/console.component';
import { TitleComponent } from './title/title.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AudioPlayerComponent } from './audio-player/audio-player.component';

@NgModule({
  declarations: [
    AppComponent,
    Canvas2DComponent,
    Canvas3DComponent,
    OptionsPanelComponent,
    ConsoleComponent,
    TitleComponent,
    AudioPlayerComponent  
    

  ],
  imports: [
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule,
    NgxAudioPlayerModule,
    FormsModule
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


