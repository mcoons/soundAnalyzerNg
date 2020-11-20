import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralOptionsComponent } from './general-options.component';

describe('GeneralOptionsComponent', () => {
  let component: GeneralOptionsComponent;
  let fixture: ComponentFixture<GeneralOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
