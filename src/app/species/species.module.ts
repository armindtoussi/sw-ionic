// Ng
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
// Ionic
import { IonicModule } from '@ionic/angular';
// Pages
import { SpeciesPage } from './species.page';
// Services
import { DataResolverService } from '../resolver/data-resolver.service';
// Components
import { SpeciesPageComponent } from './species-page/species-page.component';
import { SpeciesService } from './species.service';

export const routes: Routes = [
  {
    path: '',
    component: SpeciesPage
  },
  {
    path: 'species/:id',
    resolve: {
      special: DataResolverService,
    },
    component: SpeciesPageComponent
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
    SpeciesPage,
    SpeciesPageComponent,
  ],
  providers: [
    SpeciesService,
  ]
})
export class SpeciesPageModule {}
