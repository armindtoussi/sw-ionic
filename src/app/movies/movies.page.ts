import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

//Services
import { SwapiService } from '../services/swapi.service';

//RXJS
import { Subscription } from 'rxjs';

//Models
import { FilmsModel } from '../models/films.model';

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
   * 
   */
  constructor(private _swapiFetchService: SwapiService,
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
    if(this.movieSub != undefined) {
      this.movieSub.unsubscribe();
    }
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
          console.log("this.movies: ", this.movies);
        }
      );
  }
}
