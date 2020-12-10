import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasEffectsComponent } from './canvas-effects.component';

describe('CanvasEffectsComponent', () => {
  let component: CanvasEffectsComponent;
  let fixture: ComponentFixture<CanvasEffectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasEffectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasEffectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
