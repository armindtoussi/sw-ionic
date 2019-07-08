import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
//RXJS
import { Subscription } from 'rxjs';
//Services 
import { CacheService } from 'src/app/services/cache.service';
import { ToastService } from 'src/app/services/toast.service';
//Models
import { Species }   from 'src/app/models/species.model';
import { Film }      from 'src/app/models/films.model';
import { Character } from 'src/app/models/character.model';
//ENV
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-species-page',
  templateUrl: './species-page.component.html',
  styleUrls: ['./species-page.component.scss'],
})
export class SpeciesPageComponent implements OnInit, OnDestroy {

  speciesSubs: Subscription[];
  
  data:   Species;
  films:  Film[];
  people: Character[];

  constructor(private route:  ActivatedRoute,
              private router: Router,
              private _cache: CacheService,
              private _toast: ToastService) { }

  ngOnInit(): void {
    this.speciesSubs = [];
    this.handleData();
  }

  ngOnDestroy(): void { 
    this.unsubscribe();
  }

  isNumber(arg: any): boolean  {
    return !isNaN(parseFloat(arg)) && !isNaN(arg - 0);
  }

  private getSpecies(): void {
    let id = this.parsePath();

    this.speciesSubs[0] = this._cache.search(environment.swapiSpecies, id)
      .subscribe((data: any) => {
        if(data) {
          this.data = data.results[0];
          this.getExtraData();
        } else {
          this._toast.presentToast(environment.notFound).then(
            (res: any) => {
              this.router.navigateByUrl(`/`);
            });
        }
      });
  }

  private fetchFilms(): void {
    if(this.data.films.length === 0) {
      return;
    }

    this.speciesSubs[1] = this._cache.fetch(this.data.films)
      .subscribe((data: any) => {
        this.films = data.sort((a: Film, b: Film) => {
          return a.episode_id - b.episode_id;
        });
      });
  }

  private fetchPeople(): void {
    if(this.data.people.length === 0) {
      return; 
    }

    this.speciesSubs[2] = this._cache.fetch(this.data.people)
      .subscribe((data: any) => {
        this.people = data;
      });
  }

  private parsePath(): any {
    let idx = this.router.url.lastIndexOf('/');
    let id  = this.router.url.slice(idx + 1);
    return id;
  }

  private handleData(): void { 
    if(this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];
      this.getExtraData();
    } else {
      this.getSpecies();
    }
  }

  private getExtraData(): void {
    this.fetchFilms();
    this.fetchPeople();
  }

  /**
   * Unsubs from subs.
   */
  private unsubscribe(): void {
    for(let i = 0; i < this.speciesSubs.length; i++) {
      if(this.speciesSubs[i] !== undefined) {
        this.speciesSubs[i].unsubscribe();
      }
    }
  }
}
