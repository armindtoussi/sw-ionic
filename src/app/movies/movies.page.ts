import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//Services
import { SwapiService } from '../services/swapi.service';
//RXJS
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//Models
import { Film }        from '../models/films.model';
import { DataService } from '../services/data.service';
//ENV
import { environment } from 'src/environments/environment';
import { MoviesService } from './movies.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})

export class MoviesPage implements OnInit {
  /** Movies result array. */
  movies: Film[];
  /** Search text. */
  searchText: string;
  /** Observable, stream of sw movie. */
  $movies: Observable<Film[]>;
  
  /**
   * ctor
   * @param _swapiFetchService swapi fetch service.
   * @param _dataService service for passing data.
   * @param router for routing.
   * 
   */
  constructor(private _swapiFetchService: SwapiService,
              private _dataService: DataService,
              private __movieService: MoviesService,
              private router: Router) { }

  /**
   * OnInit lifecycle hook. 
   * Gets movies.
   * 
   */
  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Click function that navigates to movie details page.
   * Passes id, and data to service that gets resolved. 
   * 
   * @param movie the movie that was clicked. 
   */
  displayMovie(movie: Film): void {
    this._dataService.setData(movie.episode_id.toString(), movie);
    this.router.navigateByUrl(`/movie/${movie.episode_id}`);
  }

  /**
   * Search function, triggered on IonChange. 
   */
  search(): void {
    this.$movies = this.__movieService
                       .search(this.searchText, 
                               environment.swapiMovies);            
  }

  /**
   * Fetches all movies through swapi service.
   * 
   */
  public getMovies(): void {
    this.$movies = this.__movieService.getMovies();
  }
}
