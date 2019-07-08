import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//Models
import { Character } from 'src/app/models/character.model';
import { Film } from 'src/app/models/films.model';
import { Species } from 'src/app/models/species.model';
import { Starship } from 'src/app/models/starships.model';
import { Vehicle } from 'src/app/models/vehicles.model';
//RXJS
import { Subscription } from 'rxjs';
//Services]
import { ToastService } from 'src/app/services/toast.service';
import { CacheService } from 'src/app/services/cache.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.scss'],
})
export class CharacterPageComponent implements OnInit, OnDestroy {

  charSubs: Subscription[];

  data:     Character;
  films:    Film[];
  species:  Species[];
  ships:    Starship[];
  vehicles: Vehicle[];


  constructor(private route: ActivatedRoute,
              private router: Router,
              private _toast: ToastService,
              private _cache: CacheService) { }

  ngOnInit(): void {
    this.charSubs = [];
    this.handleData();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  isNumber(arg: any): boolean  {
    return !isNaN(parseFloat(arg)) && !isNaN(arg - 0);
  }

  private getCharacter(): void {
    let id = this.parsePath();

    this.charSubs[0] = this._cache.search(environment.swapiPeople, id)
      .subscribe((data: any) => {
        if(data) {
          this.data = data.results[0];
          console.log("get data? ", this.data);
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

    this.charSubs[1] = this._cache.fetch(this.data.films)
      .subscribe((data: any) => {
        this.films = data.sort((a, b) => {
          return a.episode_id - b.episode_id;
        });
        console.log("films: ", this.films);
      });
  }

  private fetchSpecies(): void {
    if(this.data.species.length === 0) {
      return;
    }

    this.charSubs[2] = this._cache.fetch(this.data.species) 
      .subscribe((data: any) => {
        this.species = data;
        console.log("Species: ", this.species);
      });
  }

  private fetchStarships(): void {
    if(this.data.starships.length === 0) {
      return; 
    }

    this.charSubs[3] = this._cache.fetch(this.data.starships)
      .subscribe((data: any) => {
        this.ships = data;
        console.log("ships: ", this.ships);
      }); 
  }

  private fetchVehicles(): void {
    if(this.data.vehicles.length === 0) {
      return; 
    }

    this.charSubs[4] = this._cache.fetch(this.data.vehicles)
      .subscribe((data: any) => {
        this.vehicles = data;
        console.log("vehicles: ", this.vehicles);
      })
  }

  private handleData(): void {
    if(this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];

      console.log("DATA; ", this.data);
      this.getExtraData();
    } else {
      this.getCharacter();
    }
  }

  private getExtraData(): void {
    this.fetchFilms();
    this.fetchSpecies();
    this.fetchStarships();
    this.fetchVehicles();
  }

  private parsePath(): any {
    let idx = this.router.url.lastIndexOf('/');
    let id  = this.router.url.slice(idx + 1);
    return id;
  }

  /**
   * Unsubs from subs.
   */
  private unsubscribe(): void {
    for(let i = 0; i < this.charSubs.length; i++) {
      if(this.charSubs[i] !== undefined) {
        this.charSubs[i].unsubscribe();
      }
    }
  }
}
