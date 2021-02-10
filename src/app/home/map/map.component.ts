import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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


  public stations: Station[] = [];

  overlayHidden: boolean = true;

  //contient la carte
  googleMap: GoogleMap;
  centerMapOnInit: LatLng;
  isMarkerClicked: boolean = false;
  polluantsStationClicked: Polluant[];
  markers: any[] = [];


  constructor(public alertController: AlertController,
    public actionCtrl: ActionSheetController,
    private platform: Platform, private mapService: MapService,
    private cdf: ChangeDetectorRef) {

  }

  //Erreur de récupération des données de station
  ngOnInit() {

    return this.mapService.getAllStation()

      //recuperer chaque station
      .pipe(
        map(stationServeur => {
          stationServeur.forEach(station => {
            this.stations.push(new Station(station));
            //console.log(station);
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

        //console.log("center" + this.centerMapOnInit);

        this.googleMap.setCameraTarget(coordinates);
        this.googleMap.setCameraZoom(12);
      });

      this.googleMap.on(GoogleMapsEvent.MAP_DRAG_START).subscribe(() => {
        console.log("Drag detected");
        this.hideOverlay()
      })

    });

    const coordinatesMtp = new LatLng(43.6074855, 3.8992668);
    this.googleMap.addMarker({
      position: coordinatesMtp,
      Map,
      title: "Marker Test Mockup",
    }).then(marker => {
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(value => {
        this.viewDataMarkerMockup();
      });
    });

  }

  ngAfterViewInit() {
    this.platform.ready().then(() => this.loadMap());
  }

  /**
   * Changement de la vue (mode de map)
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

  //afficher les polluants d'une station
  viewDataMarker(marker: Marker) {
    let idStationMarker: number = parseInt(marker.getTitle().slice(0, 2));
    //console.log("Station clicked :" + idStationMarker);
    this.mapService.getStation(idStationMarker).subscribe(stationFromBack => {
      console.log(stationFromBack);
      this.polluantsStationClicked = stationFromBack;
      this.isMarkerClicked = true;
      this.showOverlay();
    }
    )
  }

  viewDataMarkerMockup() {
    this.polluantsStationClicked = [
      {
        dateDebut: new Date("2021-02-03T09:00:00"),
        dateFin: new Date("2021-01-23T23:00:00"),
        nom: "NO",
        unite: "horaire",
        valeur: 0.2
      },
      {
        dateDebut: new Date("2021-02-03T09:00:00"),
        dateFin: new Date("2021-01-23T23:00:00"),
        nom: "NOX",
        unite: "horaire",
        valeur: 3
      },
      {
        dateDebut: new Date("2021-02-03T09:00:00"),
        dateFin: new Date("2021-01-23T23:00:00"),
        nom: "O2",
        unite: "horaire",
        valeur: 5
      }
    ]
    this.isMarkerClicked = true;
    this.showOverlay();
  }

  //Gérer l'affichage de l'overlay contenant 
  public showOverlay() {
    this.overlayHidden = false;
    this.cdf.detectChanges();
  }

  public hideOverlay() {
    this.overlayHidden = true;
    this.cdf.detectChanges(); // Force le rechargement de template by Angular
  }

}
