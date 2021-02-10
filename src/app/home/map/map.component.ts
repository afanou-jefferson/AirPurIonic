import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, GoogleMapOptions, Marker, MarkerOptions, GoogleMapsMapTypeId } from '@ionic-native/google-maps';
import { ActionSheetController, Platform, AlertController } from '@ionic/angular';
import { MapService } from './core/map.service';
import { Station } from './core/station.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Polluant } from './core/polluant.model'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {

  // // Pour teter avec objet
  // ville = [
  //   {
  //     position: { lng: 43.6600980666535, lat: 3.035913988993468 },
  //     title: "Montpellier"
  //   }
  // ];

  // Depuis Jeff
  public stations: Station[] = [];
  markers: any[] = [];
  isMarkerClicked: boolean = false;
  markerLoaded: boolean = false;
  polluantsStationClicked: Polluant[];

  centerMapOnInit: LatLng;
  overlayHidden: boolean = true;

  //contient notre carte
  googleMap: GoogleMap;


  constructor(public alertController: AlertController,
    public actionCtrl: ActionSheetController,
    private platform: Platform, private mapService: MapService) {

  }

  //Erreur de récupération des données de station
  ngOnInit() {


    return this.mapService.getAllStation()

      //recuperer chaque station
      .pipe(
        map(stationServeur => {
          stationServeur.forEach(station => {
            this.stations.push(new Station(station));
            console.log(station);
          })
          return this.stations;
        }),
      )

      //pour chaque station ajouter un marker sur la map
      .subscribe(
        listeStationRecues => {
          this.stations.forEach(station => {

            let marker: Marker = this.googleMap.addMarkerSync({
              title: station.id + " - " + station.nomCommune,
              //icon: 'blue',
              //animation: 'DROP',
              position: {
                lat: station.latitude,
                lng: station.longitude
              }
            });

            marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(value => {
              this.viewDataMarker(marker);
            });

          },


          )
        },
        error => console.log(error)
      )
  }


  /**
   * Fonction pour charger ma carte
   * // on met ici notre clé d'environnement
   */
  loadMap() {
    GoogleMaps.getPlugin().environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyCH3ILcHPLgysmK8T65TPrEkbgPtfDNnXg',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyCH3ILcHPLgysmK8T65TPrEkbgPtfDNnXg'
    });

    // je crée ma carte ici : je stock ici dans map_canvas (je html): qui est mon id html dans le DOM
    this.googleMap = GoogleMaps.create('map_canvas');
    this.googleMap.one(GoogleMapsEvent.MAP_READY).then((data: any) => {

      this.googleMap.getMyLocation().then(location => {
        this.centerMapOnInit = location.latLng;
        let coordinates: LatLng = new LatLng(43.6600980666535, 3.035913988993468);

        if (!!this.centerMapOnInit) {
          coordinates = this.centerMapOnInit;
        }

        console.log("center" + this.centerMapOnInit);

        //const coordinates: LatLng = this.centerMapOnInit;
        this.googleMap.setCameraTarget(coordinates);
        this.googleMap.setCameraZoom(12);
      });



    });

  }

  ngAfterViewInit() {
    this.platform.ready().then(() => this.loadMap());
  }


  /**
   * Test ajout de Markeur de géolocalisation : Titre du lieu ou on est / Choix de lieu / à revoir 
   */
  placeMarker(markerTitle: string) {
    const marker: Marker = this.googleMap.addMarkerSync({
      title: markerTitle,
      icon: 'blue',
      animation: 'DROP',
      position: this.googleMap.getCameraPosition().target
    });
  }

  /**
   * ajout de Markeur via formulaire
   */
  async addMarkerLieu() {
    const alert = await this.alertController.create({
      header: 'Ajouter un marqueur',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Le titre'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ajouter',
          handler: data => {
            console.log('Titre: ' + data.title);
            this.placeMarker(data.title);
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Changement de la vue ( mode de map)
   */
  async mapOptions() {
    const actionSheet = await this.actionCtrl.create({
      buttons: [{
        text: 'Satellite',
        handler: () => {
          console.log('Satellite clicked');
          this.googleMap.setMapTypeId(GoogleMapsMapTypeId.SATELLITE);
        }
      }, {
        text: 'Plan',
        handler: () => {
          console.log('Plan clicked');
          this.googleMap.setMapTypeId(GoogleMapsMapTypeId.NORMAL);
        }
      }, {
        text: 'Terrain',
        handler: () => {
          console.log('Terrain clicked');
          this.googleMap.setMapTypeId(GoogleMapsMapTypeId.TERRAIN);
        }
      }, {
        text: 'Annuler',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  viewDataMarker(marker: Marker) {
    let idStationMarker: number = parseInt(marker.getTitle().slice(0, 2));
    console.log("Station clicked :" + idStationMarker);
    this.mapService.getStation(idStationMarker).subscribe(stationFromBack => {
      console.log(stationFromBack);
      this.polluantsStationClicked = stationFromBack;
      this.isMarkerClicked = true;
      this.hideOverlay();
    }
    )
  }

  /**Ajout de localisation instantané */
  // // Get the current device location "without map"
  // var option = {
  //   enableHighAccuracy: true // use GPS as much as possible
  // };
  // this.plugin.google.maps.LocationService.getMyLocation(option, function (location) {

  //   // Create a map with the device location
  //   var mapDiv = document.getElementById('map_canvas');
  //   var map = this.plugin.google.maps.Map.getMap(mapDiv, {
  //     'camera': {
  //       target: location.latLng,
  //       zoom: 16
  //     }
  //   });
  // });

  public hideOverlay() {
    this.overlayHidden = false;
}

}
