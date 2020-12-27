import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualEffectsComponent } from './visual-effects.component';

describe('VisualEffectsComponent', () => {
  let component: VisualEffectsComponent;
  let fixture: ComponentFixture<VisualEffectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualEffectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualEffectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
