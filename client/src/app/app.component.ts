import { Component, OnInit } from '@angular/core';
import { PodcastService } from './services/podcast.service';
import { FirestoreService } from './services/firestore.service';
import { Episode } from './models/episode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  episodes: any;
  showDetails: boolean = false;
  townDetails: Episode;
  episodeDate: string;


  constructor(private podcastService: PodcastService,
    private firestore: FirestoreService,) {
      this.setTownDetails = this.setTownDetails.bind(this);
    }

    ngOnInit(): void {
      this.firestore.getEpisodeData().subscribe(
        data => {
          this.episodes = data;
        }
      )
    }

  gatherEpisodeData() {
    this.podcastService.getNewEpisodeData(this.episodes.length).subscribe(res =>
      {
        res.data.forEach(episode => {
          this.firestore.saveEpisodeData(episode).then(res => { console.log(res); })
        })
      })
  }

  setTownDetails(town: any) {
    let date = new Date(town.date);
    this.episodeDate = date.toLocaleDateString("en-US", {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
    this.townDetails = town;
    this.showDetails = true;
  }

  deselectDetails() {
    this.showDetails = false;
  }

}
