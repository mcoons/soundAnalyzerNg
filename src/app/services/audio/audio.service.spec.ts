import { TestBed } from '@angular/core/testing';
import { WindowRefService } from '../../services/window-ref/window-ref.service';

import { AudioService } from './audio.service';

describe('AudioService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      WindowRefService
    ]
  }));

  it('should be created', () => {
    const service: AudioService = TestBed.get(AudioService);
    expect(service).toBeTruthy();
  });
});
