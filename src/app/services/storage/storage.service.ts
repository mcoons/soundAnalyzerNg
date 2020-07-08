import { Injectable, Inject } from '@angular/core';
import { WindowRefService } from '../window-ref/window-ref.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(WindowRefService) private windowRefService: WindowRefService) {
    console.log('Storage Service Constructor');
   }

  loadOptions() {
    const retrievedOptions = this.windowRefService.localStore.getItem('options');
    if (retrievedOptions) {
      return JSON.parse(retrievedOptions);
    } else {
      return {error: 'local storage error'};
    }
  }

  saveOptions(options) {
    this.windowRefService.localStore.setItem('options', JSON.stringify(options));
  }

  deleteOptions() {
    this.windowRefService.localStore.removeItem('options');
  }

}
