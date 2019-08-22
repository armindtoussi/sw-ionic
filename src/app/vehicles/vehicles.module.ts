import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
//Ionic
import { IonicModule } from '@ionic/angular';
//Pages
import { VehiclesPage } from './vehicles.page';
//Services
import { DataResolverService } from '../resolver/data-resolver.service';
//Components
import { VehiclesPageComponent } from './vehicles-page/vehicles-page.component';

export const routes: Routes = [
  {
    path: '',
    component: VehiclesPage
  },
  {
    path: 'vehicle/:id',
    resolve: {
      special: DataResolverService,
    },
    component: VehiclesPageComponent
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
    VehiclesPage,
    VehiclesPageComponent,
  ]
})
export class VehiclesPageModule {}
