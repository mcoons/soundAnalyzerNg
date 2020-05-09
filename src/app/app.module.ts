
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { TooltipModule } from 'ng2-tooltip-directive';


import { WindowRefService } from './services/window-ref/window-ref.service';


import { AppComponent } from './app.component';
import { Canvas2DComponent } from './components/canvas2-d/canvas2-d.component';
import { Canvas3DComponent } from './components/canvas3-d/canvas3-d.component';
import { OptionsPanelComponent } from './components/options-panel/options-panel.component';
import { TitleComponent } from './components/title/title.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { MyPlayerComponent } from './components/my-player/my-player.component';

@NgModule({
   declarations: [
      AppComponent,
      Canvas2DComponent,
      Canvas3DComponent,
      OptionsPanelComponent,
      TitleComponent,
      SplashScreenComponent,
      MyPlayerComponent
   ],
   imports: [
      BrowserModule,
      NgbModule,
      BrowserAnimationsModule,
      FormsModule,
      TooltipModule
   ],
   providers: [
      WindowRefService
   ],
   bootstrap: [
      AppComponent
   ]
})

export class AppModule { }
