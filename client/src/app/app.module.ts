import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { EpisodesComponent } from './components/episodes/episodes.component';
import { EpisodeListComponent } from './components/episode-list/episode-list.component';
import { MurderMapComponent } from './components/murder-map/murder-map.component';

@NgModule({
  declarations: [
    AppComponent,
    EpisodesComponent,
    EpisodeListComponent,
    MurderMapComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
