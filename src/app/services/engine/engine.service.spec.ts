import { TestBed } from '@angular/core/testing';
import { WindowRefService } from '../../services/window-ref/window-ref.service';

import { EngineService } from './engine.service';

describe('EngineService', () => {
  let service: EngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WindowRefService
      ]
    });
    service = TestBed.inject(EngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
