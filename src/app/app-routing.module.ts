import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  { 
    path: 'movies', 
    loadChildren: './movies/movies.module#MoviesPageModule' 
  },
  { 
    path: 'characters', 
    loadChildren: './characters/characters.module#CharactersPageModule' 
  },
  { 
    path: 'planets', 
    loadChildren: './planets/planets.module#PlanetsPageModule' 
  },
  { 
    path: 'starships', 
    loadChildren: './starships/starships.module#StarshipsPageModule' 
  },
  { 
    path: 'species', 
    loadChildren: './species/species.module#SpeciesPageModule' 
  },
  { 
    path: 'vehicles', 
    loadChildren: './vehicles/vehicles.module#VehiclesPageModule' 
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
