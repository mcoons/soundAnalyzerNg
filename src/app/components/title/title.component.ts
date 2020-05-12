
import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { OptionsService } from '../../services/options/options.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})

export class TitleComponent  {
  @Input('title') title: string;

  subscription: Subscription;

  constructor(public optionsService: OptionsService) {}

}
