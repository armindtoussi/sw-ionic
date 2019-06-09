import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

//Ionic
import { IonicModule } from '@ionic/angular';

//Pages
import { MoviesPage } from './movies.page';

//Components
import { MoviePageComponent } from './movie-page/movie-page.component';

const routes: Routes = [
  {
    path: '',
    component: MoviesPage
  },
  {
    path: 'movie',
    component: MoviePageComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    MoviesPage, 
    MoviePageComponent
  ],
})
export class MoviesPageModule {}
