import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WindowRefService } from '../../services/window-ref/window-ref.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MyPlayerComponent } from './my-player.component';

describe('MyPlayerComponent', () => {
  let component: MyPlayerComponent;
  let fixture: ComponentFixture<MyPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPlayerComponent ],
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
    fixture = TestBed.createComponent(MyPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
