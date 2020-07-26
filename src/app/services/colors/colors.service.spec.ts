import { TestBed } from '@angular/core/testing';

import { ColorsService } from './colors.service';
import { WindowRefService } from '../../services/window-ref/window-ref.service';


describe('ColorsService', () => {
  let service: ColorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WindowRefService
      ]
    });
    service = TestBed.inject(ColorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
