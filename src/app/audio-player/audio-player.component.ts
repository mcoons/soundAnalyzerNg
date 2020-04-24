import { Component, OnInit, Input } from '@angular/core';
import { OptionsService } from '../options.service';
import { Track } from 'ngx-audio-player';   

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit {
  @Input() playlist: Track[];
  @Input() autoPlay: false;
  @Input() displayTitle: true;
  @Input() displayPlaylist: true;
  @Input() pageSizeOptions = [2, 4, 6];
  @Input() expanded = true;
  @Input() displayVolumeControls = true;

  msaapDisplayTitle = true;
  msaapDisplayPlayList = true;
  msaapPageSizeOptions = [2,4,6];
  msaapDisplayVolumeControls = true;

  msaapPlaylist: Track[];

  constructor(public optionsService: OptionsService) { }

  ngOnInit() {
// Material Style Advance Audio Player Playlist
this.msaapPlaylist = [
  {
    title: 'A Good Bass for Gambling',
    link: './assets/tracks/A Good Bass for Gambling.mp3'
  },
  {
    title: 'Ambient Bongos',
    link: './assets/tracks/Ambient Bongos.mp3'
  },
  {
    title: 'Arpent',
    link: './assets/tracks/Arpent.mp3'
  },
];
  }


   


}
