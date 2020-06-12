import { Injectable } from '@angular/core';
import { WindowRefService } from '../window-ref/window-ref.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private windowRefService: WindowRefService) { }

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

}