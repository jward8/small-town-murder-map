import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PodcastService {

  BASE_URL = environment.server_url;

  constructor(private http: HttpClient) { }

  getEpisodeData(): Observable<any> {
    return this.http.get<any>(this.BASE_URL + '/rssData');
  }
}
