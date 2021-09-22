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
  })

  // llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];


  constructor(private fb: FormBuilder,
              private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //Nos suscribimos al cambio del primer selector, para coger el valor seleccionado
    // this.miFormulario.get('region')?.valueChanges
    //     .subscribe( region => {
    //      console.log(region)
    //Hacemos la petición a la api con el valor seleccionado y llenamos el 2º selector
    // this.paisesService.getPaisesPorRegion( region )
    //   .subscribe( paises => {
    //     console.log(paises)
    //     this.paises = paises;
    //   }) ;
    //
    // });

    //Nos suscribimos al cambio del primer selector, para coger el valor seleccionado
    this.miFormulario.get('region')?.valueChanges
      //Gestionamos el primer observable con el operador pipe de rxjs
      .pipe(
        //Escucha el primer selector y si este cambia resetea el valor del segundo
        tap(( _ ) => {
            this.miFormulario.get('pais')?.reset('');
        }),
        //Hacemos la petición a la api con el valor del primer selector y a su vez
        // modificaremos el valor que devuelve el pipe que serán los paises de la api
        switchMap(region => this.paisesService.getPaisesPorRegion( region ) )
      )
      //Nos suscribimos al valor que nos devuelve el pipe y llenamos el 2º selector
      .subscribe(paises => {
        this.paises = paises;
      });
  }

  guardar(){
    console.log(this.miFormulario.value);
  }
}
