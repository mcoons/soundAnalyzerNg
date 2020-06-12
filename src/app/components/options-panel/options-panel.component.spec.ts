import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WindowRefService } from '../../services/window-ref/window-ref.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { OptionsPanelComponent } from './options-panel.component';

describe('OptionsPanelComponent', () => {
  let component: OptionsPanelComponent;
  let fixture: ComponentFixture<OptionsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsPanelComponent ],
      providers: [
        WindowRefService
      ],
      imports: [
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
