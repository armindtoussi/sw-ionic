import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

//Services
import { SwapiService } from '../services/swapi.service';

//RXJS
import { Subscription } from 'rxjs';

//Models
import { FilmsModel, Film }     from '../models/films.model';
import { DataService }    from '../services/data.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})

export class MoviesPage implements OnInit, OnDestroy {
  /** Movie fetch subscription. */
  movieSub: Subscription;
  /** Movies result array. */
  movies: Film[];

  /**
   * ctor
   * @param _swapiFetchService swapi fetch service.
   * @param _dataService service for passing data.
   * @param router for routing.
   * 
   */
  constructor(private _swapiFetchService: SwapiService,
              private _dataService: DataService,
              private _storage: StorageService,
              private router: Router) { }

  /**
   * OnInit lifecycle hook. 
   * Gets movies.
   * 
   */
  ngOnInit(): void {
    this._storage.getMovies().then((films: Film[] | null) => {
      if(films) {
        this.movies = films.sort((a: Film, b: Film) => {
          return a.episode_id - b.episode_id;
        });
      } else {
        this.getMovies();
      }
    });
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
  displayMovie(movie: Film): void {
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
        (results: FilmsModel) =>
        {
          console.log("Results: ", results);
          this.movies = results['results'];
          this._storage.addMovies(results);
        }
      );
  }
}
