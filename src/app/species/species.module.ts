import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
//ionic
import { IonicModule } from '@ionic/angular';
//Pages
import { SpeciesPage } from './species.page';
//Services
import { DataResolverService } from '../resolver/data-resolver.service';
//Components
import { SpeciesPageComponent } from './species-page/species-page.component';

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
  ]
})
export class SpeciesPageModule {}
