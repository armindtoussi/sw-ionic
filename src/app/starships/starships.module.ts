import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
//Ionic
import { IonicModule } from '@ionic/angular';
//Pages
import { StarshipsPage } from './starships.page';
//Services
import { DataResolverService } from '../resolver/data-resolver.service';
//Components
import { StarshipsPageComponent } from './starships-page/starships-page.component';

const routes: Routes = [
  {
    path: '',
    component: StarshipsPage
  },
  {
    path: 'starship/:id',
    resolve: {
      special: DataResolverService,
    },
    component: StarshipsPageComponent
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
    StarshipsPage,
    StarshipsPageComponent,
  ]
})
export class StarshipsPageModule {}
