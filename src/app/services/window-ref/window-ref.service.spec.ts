import { TestBed } from '@angular/core/testing';
// import { WindowRefService } from '../../services/window-ref/window-ref.service';

import { WindowRefService } from './window-ref.service';

describe('WindowRefService', () => {
  let service: WindowRefService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WindowRefService
      ]
    });
    service = TestBed.inject(WindowRefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
