// Ng
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Services
import { DataService } from '../services/data.service';
// RXJS
import { Observable } from 'rxjs';
// Models
import { Film } from '../models/films.model';
// Env
import { MoviesService } from './movies.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})

/**
 * Movie page Page.
 *
 * This page holds an example for how to do observables with
 * the async pipe.
 *
 *
 * TODO - add error handling, using the bookmark we saved on chrome as
 *        inspiration so-to-speak. when i do error handling, i should
 *        also do UI feedback on waiting for response.
 *        Can maybe use ng-container element in conjunction with ngIf
 *        in order to implement ui state feedback.
 */
export class MoviesPage implements OnInit {
  /** Movies result array. */
  movies: Film[];
  /** Search text. */
  searchText: string;
  /** Observable, stream of sw movie. */
  $movies: Observable<Film[]>;


  /**
   * ctor injects dependencies
   * @param dataService service for passing data.
   * @param router for routing.
   */
  constructor(private dataService: DataService,
              private movieService: MoviesService,
              private router: Router) { }

  /**
   * OnInit lifecycle hook.
   * Gets movies.
   */
  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Click function that navigates to movie details page.
   * Passes id, and data to service that gets resolved.
   * @param movie the movie that was clicked.
   */
  displayMovie(movie: Film): void {
    this.dataService.setData(movie.episode_id.toString(), movie);
    this.router.navigateByUrl(`/movie/${movie.episode_id}`);
  }

  /**
   * Search function, triggered on IonChange.
   */
  search(): void {
    this.$movies = this.movieService
                       .search(this.searchText);
  }

  /**
   * Fetches all movies through swapi service.
   */
  public getMovies(): void {
    this.$movies = this.movieService.getMovies();
  }
}
