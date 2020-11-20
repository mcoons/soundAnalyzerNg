import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomColorsComponent } from './custom-colors.component';

describe('CustomColorsComponent', () => {
  let component: CustomColorsComponent;
  let fixture: ComponentFixture<CustomColorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomColorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
