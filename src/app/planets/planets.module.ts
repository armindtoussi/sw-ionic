import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
//Ionic
import { IonicModule } from '@ionic/angular';
//Pages
import { PlanetsPage } from './planets.page';
//Components
import { PlanetPageComponent } from './planet-page/planet-page.component';
//Services
import { DataResolverService } from '../resolver/data-resolver.service';


const routes: Routes = [
  {
    path: '',
    component: PlanetsPage
  },
  {
    path: 'planet/:id',
    resolve: {
      special: DataResolverService,
    },
    component: PlanetPageComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    PlanetsPage,
    PlanetPageComponent,
  ]
})
export class PlanetsPageModule {}
