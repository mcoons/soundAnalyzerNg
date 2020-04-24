import { Component, OnInit } from '@angular/core';
import { OptionsService } from '../options.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit {

  constructor(private optionsService: OptionsService) { }

  ngOnInit() {
  }

}
