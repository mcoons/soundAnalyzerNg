import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WindowRefService } from '../../services/window-ref/window-ref.service';
import { By } from '@angular/platform-browser';

import { Canvas2DComponent } from './canvas2-d.component';

describe('Canvas2DComponent', () => {
  let component: Canvas2DComponent;
  let fixture: ComponentFixture<Canvas2DComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Canvas2DComponent ],
      providers: [
        WindowRefService
      ]
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

  it('should have a HTML canvas element', () => {
    const canvas = fixture.debugElement.query(By.css('canvas')).nativeElement;
    expect(canvas).toBeTruthy();
  });

  it('should have a HTML canvas element with id canvas2d', () => {
    const canvas = fixture.debugElement.query(By.css('canvas')).nativeElement;
    expect(canvas.id).toEqual('canvas2d');
  });

  it('should have canvas variable referencing HTML canvas element', () => {
    const canvas = fixture.debugElement.query(By.css('#canvas2d')).nativeElement;
    // tslint:disable-next-line: no-string-literal
    expect(component['canvas']).toEqual(canvas);
  });

  it('should have Ctx variable referencing HTML canvas element', () => {
    const canvas = fixture.debugElement.query(By.css('#canvas2d')).nativeElement;
    // tslint:disable-next-line: no-string-literal
    expect(component['ctx'].canvas).toEqual(canvas);
  });

  // it('should start render loop', () => {
  //   console.log('fixture');
  //   console.log(fixture);
  // });

});
