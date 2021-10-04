import { Component, Input, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import mapboxgl from 'mapbox-gl';
import { Episode } from '../../models/episode';

@Component({
  selector: 'murder-map',
  templateUrl: './murder-map.component.html',
  styleUrls: ['./murder-map.component.css']
})
export class MurderMapComponent implements OnInit {

  map: any;
  data: any;
  @Input() setTownDetails: any;

  constructor(private firestore: FirestoreService) { }

  ngOnInit(): void {
    this.firestore.getEpisodeData().subscribe(
      data => {
        this.data = data;
        this.createMap();
      }
    )
  }

  createMap(): void {
    mapboxgl.accessToken = `pk.eyJ1IjoiamFja21pY2hhZWwtd2FyZCIsImEiOiJja24zdWVpNGMxYjR2MnBtaGI5a216YmJkIn0.jrYVa77az9t2kplgJdgYmw`;
    let map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/jackmichael-ward/ckpa4ofcw3z5317o38q0w6xq1',
      center: [-109.909416, 40.041069],
      zoom: 4
    });

    let mapBackground = document.getElementById('map');
    
    let town = this.data;
    var title = document.getElementById('title');
    let recallDetails = this.setTownDetails;

    map.on('load', function() {

      if(this !== undefined) {
        town.forEach(function (marker) {
          var mark = document.createElement('div');
          mark.className = 'marker';
          mark.style.backgroundImage = "url(../../assets/0.33x/marker.png)"
          mark.style.width = '27px';
          mark.style.height = '27px';
          mark.addEventListener('click', function() {
            recallDetails(marker.payload.doc.data())
          })
    
          new mapboxgl.Marker(mark)
            .setLngLat(marker.payload.doc.data().geojson.geometry.coordinates)
            .addTo(map)
        })
      }
    });

    map.getCanvas().style.cursor = 'pointer';
  }

}
