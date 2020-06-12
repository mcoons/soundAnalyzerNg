import { TestBed } from '@angular/core/testing';
import { WindowRefService } from '../../services/window-ref/window-ref.service';

import { OptionsService } from './options.service';

describe('OptionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      WindowRefService
    ]
  }));

  it('should be created', () => {
    const service: OptionsService = TestBed.get(OptionsService);
    expect(service).toBeTruthy();
  });
});
