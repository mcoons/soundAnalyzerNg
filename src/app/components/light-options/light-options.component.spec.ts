import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightOptionsComponent } from './light-options.component';

describe('LightOptionsComponent', () => {
  let component: LightOptionsComponent;
  let fixture: ComponentFixture<LightOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
