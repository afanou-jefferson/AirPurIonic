import { AfterViewInit, Component, OnInit } from '@angular/core';
import {GoogleMaps, GoogleMap,GoogleMapsEvent,LatLng} from '@ionic-native/google-maps';
import { ActionSheetController, Platform, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {

  map: GoogleMap;

  constructor( public alertController: AlertController, public actionCtrl: ActionSheetController, private platform: Platform ) { 
    
  }

  ngOnInit() {}

  loadMap() {
    GoogleMaps.getPlugin().environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyCH3ILcHPLgysmK8T65TPrEkbgPtfDNnXg',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyCH3ILcHPLgysmK8T65TPrEkbgPtfDNnXg' 
    });

    const map = GoogleMaps.create('map_canvas');
    map.one( GoogleMapsEvent.MAP_READY ).then((data: any) => {
			const coordinates: LatLng = new LatLng(43.6600980666535, 3.035913988993468);

			map.setCameraTarget(coordinates);
			map.setCameraZoom(12);
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
}
