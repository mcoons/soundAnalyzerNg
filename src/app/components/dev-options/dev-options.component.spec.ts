import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevOptionsComponent } from './dev-options.component';

describe('DevOptionsComponent', () => {
  let component: DevOptionsComponent;
  let fixture: ComponentFixture<DevOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
