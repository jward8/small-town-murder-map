import { Component } from '@angular/core';
import { PodcastService } from './services/podcast.service';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  episodes: any;

  constructor(private podcastService: PodcastService,
    private firestore: FirestoreService,) {}
  
  loadandStoreData() {
    this.podcastService.getEpisodeData().subscribe(data => {
      console.dir(data.data)
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

}
