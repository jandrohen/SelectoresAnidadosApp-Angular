import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PaisSmall} from "../interfaces/paises.interfaces";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.com/v2';

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [ ...this._regiones ];
  }
  constructor(private http: HttpClient) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {

    const url: string = `${ this._baseUrl }/continent/${ region }?fields=`;
    return this.http.get<PaisSmall[]>(url);
  }

}
