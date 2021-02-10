import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Station } from './station.model';
@Injectable({
    providedIn: 'root'
})
export class MapService {

    constructor(private http: HttpClient) {
    }

    getAllStation(): Observable<Station[]> {
        return this.http.get<Station[]>(`${environment.baseUrl}${environment.getAllStations}`);

    }  

}

