import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
//RXJS 
import { Subscription } from 'rxjs';
//Models
import { Starship }  from 'src/app/models/starships.model';
import { Character } from 'src/app/models/character.model';
import { Film }      from 'src/app/models/films.model';
//Services
import { CacheService } from 'src/app/services/cache.service';
import { ToastService } from 'src/app/services/toast.service';
//ENV
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-starships-page',
  templateUrl: './starships-page.component.html',
  styleUrls: ['./starships-page.component.scss'],
})
export class StarshipsPageComponent implements OnInit, OnDestroy {

  shipSub: Subscription[];

  data: Starship;
  films: Film[];
  pilots: Character[]

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _cache: CacheService,
              private _toast: ToastService) { }

  ngOnInit(): void {
    this.shipSub = [];
    this.handleData();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  isNumber(arg: any): boolean  {
    return !isNaN(parseFloat(arg)) && !isNaN(arg - 0);
  }

  private getStarship(): void {
    let id = this.parsePath();
    
    this.shipSub[0] = this._cache.search(environment.swapiShips, id)
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

    this.shipSub[1] = this._cache.fetch(this.data.films)
      .subscribe((data: any) => {
        this.films = data.sort((a: Film, b: Film) => {
          return a.episode_id - b.episode_id;
        });
      });
  }

  private fetchPilots(): void {
    if(this.data.pilots.length === 0) {
      return; 
    }

    this.shipSub[2] = this._cache.fetch(this.data.pilots) 
      .subscribe((data: any) => {
        this.pilots = data;
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
      this.getStarship();
    }
  }

  private getExtraData(): void {
    this.fetchPilots();
    this.fetchFilms();
  }

  /**
   * Unsubs from subs.
   */
  private unsubscribe(): void {
    for(let i = 0; i < this.shipSub.length; i++) {
      if(this.shipSub[i] !== undefined) {
        this.shipSub[i].unsubscribe();
      }
    }
  }
}
