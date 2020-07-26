import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WindowRefService } from '../../services/window-ref/window-ref.service';
import { By } from '@angular/platform-browser';

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

  it('should have a canvas element', () => {
    const canvas = fixture.debugElement.query(By.css('canvas')).nativeElement;
    expect(canvas).toBeTruthy();
  });

  it('should have canvas element with id rendererCanvas', () => {
    const canvas = fixture.debugElement.query(By.css('canvas')).nativeElement;
    expect(canvas.id).toEqual('rendererCanvas');
  });

  // it('should have canvas variable referencing HTML canvas element', () => {
  //   const canvas = fixture.debugElement.query(By.css('#rendererCanvas')).nativeElement;
  //   // tslint:disable-next-line: no-string-literal
  //   expect(component['canvas']).toEqual(canvas);
  // });

});
