import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WindowRefService } from '../../services/window-ref/window-ref.service';

import { Canvas3DComponent } from './canvas3-d.component';

describe('Canvas3DComponent', () => {
  let component: Canvas3DComponent;
  let fixture: ComponentFixture<Canvas3DComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Canvas3DComponent ],
      providers: [
        WindowRefService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Canvas3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
