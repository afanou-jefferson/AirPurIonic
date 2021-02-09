import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
//import { MeteoIndicateur } from './meteoindicateur.model';
//import { RelevePolluant } from './relevePolluant.model';
import { Station } from './station.model';
//import { CommuneLight } from './communeLight.model';
//import { CommuneInsee } from './CommuneInsee.model';
import { share } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MapService {

    //private polluantSubject = new Subject<RelevePolluant[]>();
    //private meteoSubject = new Subject<MeteoIndicateur>();
    //static communeSearchedSubj = new Subject<CommuneInsee>();

    constructor(private http: HttpClient) {
    }

    getAllStation(): Observable<Station[]> {
        return this.http.get<Station[]>(`${environment.baseUrl}${environment.getAllStations}`);

    }
    
    
    // //    ----------------------------------  POLLUANT  ------------------------------------------------------------
    // getPolluantsByStation(idStation: number): Observable<RelevePolluant[]> {
    //     return this.http.get<RelevePolluant[]>(`${environment.baseUrl}${environment.getStation}/${idStation}`);
    // }

    // getHistoriquePolluantStation(idCommune: number, dateDebut: Date, dateFin: Date): Observable<RelevePolluant[]> {
    //    /* const params = new HttpParams()
    //         .set("idStation", `${idStation}`)
    //         .set("dateDebut", `${dateDebut}`)
    //         .set("dateFin", `${dateFin}`) */

    //     const httpOptions = {
    //         headers: new HttpHeaders({
    //             "Content-Type": "application/json"
    //         })
    //     };

    //     return this.http.post<RelevePolluant[]>(`${environment.baseUrl}${environment.getHistoriqueStation}`,
    //     { 
    //       "idCommune" : idCommune,
    //       "dateDebut" : dateDebut,
    //       "dateFin" : dateFin
    //     }, httpOptions)

    //     //return this.http.post<RelevePolluant[]>(`${environment.baseUrl}${environment.getHistoriqueStation}`,
    //       //  { params });
    // }

    // emitPolluant(releve: RelevePolluant[]) {
    //     this.polluantSubject.next(releve);
    // }

    // clearPolluant() {
    //     this.polluantSubject.next();
    // }

    // onPolluant(): Observable<RelevePolluant[]> {
    //     return this.polluantSubject.asObservable();
    // }



    // //    ----------------------------------         METEO     ------------------------------------------------------------

    // getMeteoByCommune(idCommune: number): Observable<MeteoIndicateur> {
    //     return this.http.get<MeteoIndicateur>(`${environment.baseUrl}${environment.getMeteo}/${idCommune}`);
    // }

    // emitMeteo(meteo: MeteoIndicateur) {
    //     this.meteoSubject.next(meteo);
    // }

    // onMeteo(): Observable<MeteoIndicateur> {
    //     return this.meteoSubject.asObservable();
    // }

    // clearMeteo() {
    //     this.meteoSubject.next();
    // }

    // searchCommunes(nomCommune: any): Observable<CommuneLight[]> {
    //     return this.http.get<CommuneLight[]>(`${environment.baseUrl}${environment.getCommuneALike}/${nomCommune}`)
    // }

    // getCoordGeoCommunesByCodeInsee(codeInseeCommune: string) {
    //     return this.http.get<CommuneInsee>(`https://geo.api.gouv.fr/communes/${codeInseeCommune}?fields=nom,code,codesPostaux,centre,codeDepartement,codeRegion,population&format=json&geometry=centre`)
    // }

    // //    ----------------------------------   SEARCH    ------------------------------------------------------------
    // changerCommuneSelected(commune: CommuneInsee) {
    //     //this.communeSelectedSource.next("COUCOU MAP")
    //     //console.log("Hey THERE", commune)
    // }

    // publierSearchedCommune(commune: CommuneInsee) {
    //     MapService.communeSearchedSubj.next(commune);
    // }

    // recupererSearchedCommune(): Observable<any> {
    //     return MapService.communeSearchedSubj.pipe(
    //         share()
    //     );
    // }


}

