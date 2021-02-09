import { Component, OnInit } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsMapTypeId,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';
import { ActionSheetController, Platform, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  map: GoogleMap;

  constructor( public alertController: AlertController, public actionCtrl: ActionSheetController, private platform: Platform ) { 
    if (this.platform.is('cordova')) {
      this.loadMap();
    }
    
  }

  ngOnInit() {}

  loadMap() {
    Environment.setEnv({
      API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyCH3ILcHPLgysmK8T65TPrEkbgPtfDNnXg',
      API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyCH3ILcHPLgysmK8T65TPrEkbgPtfDNnXg'
    });
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: 43.6600980666535,
          lng: 3.035913988993468
        },
        zoom: 12,
        tilt: 30
      }
    });
  }

}
