import { Component, OnInit, Input } from '@angular/core';
import { OptionsService } from '../options.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {
  @Input('title') title: string;

  constructor(public optionsService: OptionsService) { }

  ngOnInit() {
  }

}

