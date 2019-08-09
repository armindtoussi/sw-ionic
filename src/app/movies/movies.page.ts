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
//ENV
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})

export class MoviesPage implements OnInit, OnDestroy {
  /** Movie fetch subscription. */
  movieSub: Subscription[];
  /** Movies result array. */
  movies: Film[];
  /** Search text. */
  searchText: string;
  
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
    this.movieSub = [];
    this.getFilms();
  }

  /**
   * OnDestroy lifecycle hook. 
   * Unsubs from subs. 
   */
  ngOnDestroy(): void { 
    this.unsubscribe();
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
    console.log(this.searchText);
    this.movieSub[1] = this._swapiFetchService.search(this.searchText, 
                                                      environment.swapiMovies)
      .subscribe((results: any) => {
        this.movies = results.results;
      });
                        
  }

  private getFilms(): void {
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
   * Fetches all movies through swapi service.
   * 
   */
  private getMovies(): void {
    this.movieSub[0] = this._swapiFetchService.getSWMovies()
      .subscribe(
        (results: FilmsModel) =>
        {
          this.movies = results['results'];
          this._storage.addMovies(results);
        }
      );
  }

  /**
   * Unsub to subs. 
   */
  private unsubscribe(): void {
    for(let i = 0; i < this.movieSub.length; i++) {
      if(this.movieSub[i] !== undefined) {
        this.movieSub[i].unsubscribe();
      }
    }
  }
}
