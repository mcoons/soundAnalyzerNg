import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualSelectionComponent } from './visual-selection.component';

describe('VisualSelectionComponent', () => {
  let component: VisualSelectionComponent;
  let fixture: ComponentFixture<VisualSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
