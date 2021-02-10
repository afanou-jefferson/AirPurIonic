import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';



@NgModule({
  declarations: [MapComponent],

  imports: [
    CommonModule,
    IonicModule,
    HomePageRoutingModule
  ]
})
export class HomeModule { }
