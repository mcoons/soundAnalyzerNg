import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Canvas2DComponent } from './canvas2-d.component';

describe('Canvas2DComponent', () => {
  let component: Canvas2DComponent;
  let fixture: ComponentFixture<Canvas2DComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Canvas2DComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Canvas2DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
