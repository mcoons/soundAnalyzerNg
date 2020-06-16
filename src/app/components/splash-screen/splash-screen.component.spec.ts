/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { WindowRefService } from '../../services/window-ref/window-ref.service';

import { SplashScreenComponent } from './splash-screen.component';

describe('SplashScreenComponent', () => {
  let component: SplashScreenComponent;
  let fixture: ComponentFixture<SplashScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplashScreenComponent ],
      providers: [
        WindowRefService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should have a welcome message', () => {

  // });

  it('should have an OK button', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button).toBeTruthy();
  });

  it('should have OK in the button', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.innerHTML).toBe('OK');
  });



});
