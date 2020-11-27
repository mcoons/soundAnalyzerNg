
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';

import { WindowRefService } from './services/window-ref/window-ref.service';
import { AudioModule } from './audio/audio.module';
import { AppComponent } from './app.component';
import { Canvas2DComponent } from './components/canvas2-d/canvas2-d.component';
import { Canvas3DComponent } from './components/canvas3-d/canvas3-d.component';
// import { OptionsPanelComponent } from './components/options-panel/options-panel.component';
import { TitleComponent } from './components/title/title.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
// import { FavoritesPanelComponent } from './components/favorites-panel/favorites-panel.component';
import { UserOptionsComponent } from './components/user-options/user-options.component';
import { GeneralOptionsComponent } from './components/general-options/general-options.component';
import { NoteComponent } from './components/note/note.component';
import { VisualEffectsComponent } from './components/visual-effects/visual-effects.component';
import { CustomColorsComponent } from './components/custom-colors/custom-colors.component';
import { ColorComponent } from './components/color/color.component';
import { DevOptionsComponent } from './components/dev-options/dev-options.component';
import { LightOptionsComponent } from './components/light-options/light-options.component';
import { LightComponent } from './components/light/light.component';
import { PanelLeftComponent } from './components/panel-left/panel-left.component';
import { PanelRightComponent } from './components/panel-right/panel-right.component';
import { VisualSelectionComponent } from './components/visual-selection/visual-selection.component';

@NgModule({
   declarations: [
      AppComponent,
      Canvas2DComponent,
      Canvas3DComponent,
      // OptionsPanelComponent,
      TitleComponent,
      SplashScreenComponent,
      // FavoritesPanelComponent,
      UserOptionsComponent,
      GeneralOptionsComponent,
      NoteComponent,
      VisualEffectsComponent,
      CustomColorsComponent,
      ColorComponent,
      DevOptionsComponent,
      LightOptionsComponent,
      LightComponent,
      PanelLeftComponent,
      PanelRightComponent,
      VisualSelectionComponent,
   ],
   imports: [
      BrowserModule,
      NgbModule,
      BrowserAnimationsModule,
      FormsModule,
      MatExpansionModule,
      AudioModule
   ],
   providers: [
      WindowRefService,

   ],
   bootstrap: [
      AppComponent
   ]
})

export class AppModule { }
