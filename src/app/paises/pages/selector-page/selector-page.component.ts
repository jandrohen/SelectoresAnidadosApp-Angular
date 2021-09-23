import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {switchMap, tap} from "rxjs/operators";

import { PaisesService } from '../../services/paises.service';
import {PaisSmall} from "../../interfaces/paises.interfaces";

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  })

  // llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];


  // UI
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //Nos suscribimos al cambio del primer selector(CONTINENTE), para coger el value seleccionado
    this.miFormulario.get('region')?.valueChanges
      //Gestionamos el primer observable con el operador pipe de rxjs
      .pipe(
        //Escucha el primer selector y si este cambia resetea el valor del segundo
        tap(( _ ) => {
            this.miFormulario.get('pais')?.reset('');
            this.cargando = true;
        }),
        //Hacemos la petición a la api con el valor del primer selector y a su vez
        // modificaremos el valor que devuelve el pipe que serán los paises de la api
        switchMap(region => this.paisesService.getPaisesPorRegion( region ))
      )
      //Nos suscribimos al valor que nos devuelve el pipe y llenamos el 2º selector
      //en el value insertamos los códigos y lo visual el nombre del pais
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });


    //Nos suscribimos al cambio del segundo selector(PAIS), para coger el value seleccionado
    this.miFormulario.get('pais')?.valueChanges
      //Gestionamos el primer observable con el operador pipe de rxjs
      .pipe(
        //Escucha el segundo selector(PAIS) y si este cambia resetea el valor del tercer selector
        tap(( _ ) => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        //Hacemos la petición a la api con el valor del segundo selector(PAIS) y modificaremos el valor que devuelve
        // el pipe devolviendo el objeto Pais
        switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo)),
        //Cogemos los codigos de los paises que hacen frontera y hacemos una petición filtrada por cada uno de ellos
        //estos nos devuelve un array de paises con codigo y nombre
        switchMap( pais => this.paisesService.getPaisPorCodigos(pais?.borders!))
      )
      //Nos suscribimos al valor que nos devuelve el pipe y llenamos el tercer selector(FRONTERAS)
      //con el código de los países fronterizos y los nombres de cada uno
      .subscribe( paises => {
        this.fronteras = paises;
        this.cargando = false;
      } )
  }

  guardar(){
    console.log(this.miFormulario.value);
  }
}
