import { Component, OnInit } from '@angular/core';
import { PodcastService } from './services/podcast.service';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  episodes: any;

  constructor(private podcastService: PodcastService,
    private firestore: FirestoreService,) {}

    ngOnInit(): void {
      this.firestore.getEpisodeData().subscribe(
        data => {
          this.episodes = data;
        }
      )
    }
  
  loadandStoreData() {
    this.podcastService.getEpisodeData().subscribe(data => {
      data.data.forEach(podcast => {
        this.firestore.saveEpisodeData(podcast)
          .then(res => { console.log(res); })
      })
    })
  }

  getEpisodeData() {
    this.firestore.getEpisodeData().subscribe(res =>{
      this.episodes = res
    });
  }

  gatherEpisodeData() {
    this.podcastService.getNewEpisodeData(this.episodes.length).subscribe(res =>
      {
        console.log(res);
        res.data.forEach(episode => {
          this.firestore.saveEpisodeData(episode).then(res => { console.log(res); })
        })
      })
  }

}
