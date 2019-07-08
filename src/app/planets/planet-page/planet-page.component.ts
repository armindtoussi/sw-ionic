import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//Models
import { Planet }    from 'src/app/models/planets.model';
import { Film }      from 'src/app/models/films.model';
import { Character } from 'src/app/models/character.model';
//RXJS
import { Subscription } from 'rxjs';
//ENV
import { environment } from 'src/environments/environment';
//Services
import { CacheService } from 'src/app/services/cache.service';
import { ToastService } from 'src/app/services/toast.service';



@Component({
  selector: 'app-planet-page',
  templateUrl: './planet-page.component.html',
  styleUrls: ['./planet-page.component.scss'],
})
export class PlanetPageComponent implements OnInit, OnDestroy {

  planetSubs: Subscription[];

  data: Planet;

  films: Film[];
  residents: Character[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _toast: ToastService,
              private _cache: CacheService) { }

  ngOnInit(): void {
    this.planetSubs = [];
    this.handleData();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  isNumber(arg: any): boolean  {
    return !isNaN(parseFloat(arg)) && !isNaN(arg - 0);
  }

  private getPlanet(): void {
    let id = this.parsePath();

    this.planetSubs[2] = this._cache.search(environment.swapiPlanets, id)
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

  private fetchResidents(): void {
    if(this.data.residents.length === 0) {
      return;
    }

    this.planetSubs[0] = this._cache.fetch(this.data.residents)
      .subscribe((data: any) => {
          this.residents = data;
      });
  }

  private fetchFilms(): void {
    if(this.data.films.length === 0) {
      return;
    }

    this.planetSubs[1] = this._cache.fetch(this.data.films)
      .subscribe((data: any) => {
        this.films = data;
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

      console.log('data: ', this.data);
      this.getExtraData();
    } else {
      this.getPlanet();
    }
  }

  private getExtraData(): void {
    this.fetchResidents();
    this.fetchFilms();
  }

  /**
   * Unsubs from subs.
   */
  private unsubscribe(): void {
    for(let i = 0; i < this.planetSubs.length; i++) {
      if(this.planetSubs[i] !== undefined) {
        this.planetSubs[i].unsubscribe();
      }
    }
  }
}
