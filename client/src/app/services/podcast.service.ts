import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
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

  getNewEpisodeData(size: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('size', size.toString());

    return this.http.get<any>(this.BASE_URL + '/newEpisodes', {params: params});
  }
}
