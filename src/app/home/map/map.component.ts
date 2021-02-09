import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng } from '@ionic-native/google-maps';
import { ActionSheetController, Platform, AlertController } from '@ionic/angular';
import { Station } from './core/station.model';
import { Observable } from 'rxjs';
import { MapService } from './core/map.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {

  googleMap: GoogleMap;

  stations: Station[] = [];
  markers: any[] = [];

  markerLoaded: boolean = false;

  constructor(public alertController: AlertController, public actionCtrl: ActionSheetController, private platform: Platform, private mapService: MapService) {

  }

  ngOnInit() {
    //recuperer chaque station
    //pour chaque station ajouter un marker sur la map
    return this.mapService.getAllStation()

      .pipe(
        map(stationServeur => {
          stationServeur.forEach(station => {
            this.stations.push(new Station(station));
            //console.log( station );
          })
          return this.stations;
        }),
      )

      .subscribe(
        listeStationRecues => {
          this.putMarkers()
        },
        error => console.log(error)
      )
  }


  loadMap() {
    GoogleMaps.getPlugin().environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyCH3ILcHPLgysmK8T65TPrEkbgPtfDNnXg',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyCH3ILcHPLgysmK8T65TPrEkbgPtfDNnXg'
    });

    this.googleMap = GoogleMaps.create('map_canvas');
    this.googleMap.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
      const coordinates: LatLng = new LatLng(43.6600980666535, 3.035913988993468);

      this.googleMap.setCameraTarget(coordinates);
      this.googleMap.setCameraZoom(12);
    });
    // this.map = GoogleMaps.create('map_canvas', {
    //   camera: {
    //     target: {
    //       lat: 43.6600980666535,
    //       lng: 3.035913988993468
    //     },
    //     zoom: 12,
    //     tilt: 30
    //   }
    // });
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => this.loadMap());
  }


  putMarkers() {
    console.log("coucou")
    var bounds = [];
    var markers = this.stations.map(
      function (station) {
        var positionMarker = { lng: station.longitude, lat: station.latitude };
        bounds.push(positionMarker);
        return () => this.googleMap.addMarker(station);
      });
  }
}


