import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

//Services
import { SwapiService } from '../services/swapi.service';

//RXJS
import { Subscription } from 'rxjs';

//Models
import { FilmsModel } from '../models/films.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})

export class MoviesPage implements OnInit, OnDestroy {
  /** Movie fetch subscription. */
  movieSub: Subscription;
  /** Movies result array. */
  movies: FilmsModel[];

  /**
   * ctor
   * @param _swapiFetchService swapi fetch service.
   * @param _dataService service for passing data.
   * @param router for routing.
   * 
   */
  constructor(private _swapiFetchService: SwapiService,
              private _dataService: DataService,
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
   * OnDestroy lifecycle hook. 
   * Unsubs from subs. 
   * 
   */
  ngOnDestroy(): void { 
    if(this.movieSub !== undefined) {
      this.movieSub.unsubscribe();
    }
  }

  /**
   * Click function that navigates to movie details page.
   * Passes id, and data to service that gets resolved. 
   * 
   * @param movie the movie that was clicked. 
   */
  displayMovie(movie: FilmsModel): void {
    this._dataService.setData(movie.episode_id.toString(), movie);
    this.router.navigateByUrl(`/movie/${movie.episode_id}`);
  }

  /**
   * Fetches all movies through swapi service.
   * 
   */
  private getMovies(): void {
    this.movieSub = this._swapiFetchService.getSWMovies()
      .subscribe(
        (results: object) =>
        {
          this.movies = results['results'];
        }
      );
  }
}
