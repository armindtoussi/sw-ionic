import { NgModule }                from '@angular/core';
import { CommonModule }            from '@angular/common';
import { FormsModule }             from '@angular/forms';
import { Routes, RouterModule }    from '@angular/router';
//Ionic
import { IonicModule } from '@ionic/angular';
//Pages
import { MoviesPage }     from './movies.page';
import { CrawlModalPage } from './crawl-modal/crawl-modal.page';
//Components
import { MoviePageComponent } from './movie-page/movie-page.component';
//Services
import { DataResolverService } from '../resolver/data-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: MoviesPage
  },
  {
    path: 'movie/:id',
    resolve: {
      special: DataResolverService,
    },
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
    MoviePageComponent,
    CrawlModalPage,
  ],
  entryComponents: [
    CrawlModalPage,
  ]
})
export class MoviesPageModule {}
