import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
//Models
import { Film }      from 'src/app/models/films.model';
import { Character } from 'src/app/models/character.model';
import { Planet }    from 'src/app/models/planets.model';
import { Species }   from 'src/app/models/species.model';
import { Starship }  from 'src/app/models/starships.model';
import { Vehicle }   from 'src/app/models/vehicles.model';

//Services
import { StorageService } from 'src/app/services/storage.service';
import { ToastService }   from 'src/app/services/toast.service';
import { SwapiService }   from 'src/app/services/swapi.service';
//RXJS
import { Subscription } from 'rxjs';
//Env 
import { environment } from 'src/environments/environment';
import { SWapi } from 'src/app/models/SWapi.model';
import { CacheService } from 'src/app/services/cache.service';


@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss'],
})
export class MoviePageComponent implements OnInit, OnDestroy {

  movieSubs: Subscription[];

  data: Film;
  characters: Character[];
  planets:    Planet[];
  species:    Species[];
  starships:  Starship[];
  vehicles:   Vehicle[];

  constructor(private route:    ActivatedRoute, 
              private router:   Router,
              private _storage: StorageService,
              private _toast:   ToastService,
              private _cache:   CacheService,
              private _swapiService: SwapiService) { }

  ngOnInit(): void {
    this.movieSubs = [];
    this.handleData();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private async getCharacters(): Promise<void> {
    this._cache.fetchType(this.data.characters, environment.CHARS_DICT_KEY).then((result) => {
      console.log("Characters afdter $#$: ", result);
      if(result) {
        this.characters = result;
      } else {
        console.log("fetching:", this.characters);
        this.fetchCharacters();
      }
    });
  }

  private async getPlanets(): Promise<void> {
    this._storage.getFullDictionary(environment.PLANET_DICT_KEY)
      .then((planets: object) => {
        if(planets) {
          let fetchArr = this.compareFetch(planets, this.data.planets);
          this.planets = <Planet[]>this.filterDictionary(planets, this.data.planets);

          this._cache.fetchFromUrls(fetchArr, this.planets).then((res) => {
            this.planets = res;

            this._cache.cacheArray(this.planets, environment.PLANET_DICT_KEY);
          });
        } else {
          this.fetchPlanets();
        }
      });
  }

  private async getSpecies(): Promise<void> {
    this._storage.getFullDictionary(environment.SPECIES_DICT_KEY)
      .then((species: object) => {
        if(species) {
          let fetchArr = this.compareFetch(species, this.data.species);
          this.species = <Species[]>this.filterDictionary(species, this.data.species);

          this._cache.fetchFromUrls(fetchArr, this.species).then((res) => {
            this.species = res;

            this._cache.cacheArray(this.species, environment.SPECIES_DICT_KEY);
          });
        } else {
          this.fetchSpecies();
        }
      });
  }

  //gets are from cache. 
  private async getStarships(): Promise<void> {
    this._storage.getFullDictionary(environment.SHIPS_DICT_KEY)
      .then((ships: object) => {
        if(ships) {
          let fetchArr   = this.compareFetch(ships, this.data.starships);
          this.starships = <Starship[]>this.filterDictionary(ships, this.data.starships);

          this._cache.fetchFromUrls(fetchArr, this.starships).then((res) => {
            this.starships = res;

            this._cache.cacheArray(this.starships, environment.SHIPS_DICT_KEY);
          });
        } else {
          this.fetchStarships();
        }
      });
  }

  private async getVehicles(): Promise<void> {
    this._storage.getFullDictionary(environment.VEHICLE_DICT_KEY)
      .then((vehicles: any) => {
        if(vehicles) {
          let fetchArr = this.compareFetch(vehicles, this.data.vehicles);
          this.vehicles = <Vehicle[]>this.filterDictionary(vehicles, this.data.vehicles);

          this._cache.fetchFromUrls(fetchArr, this.vehicles).then((res) => {
            this.vehicles = res;

            this._cache.cacheArray(this.vehicles, environment.VEHICLE_DICT_KEY);
          });
        } else {
          this.fetchVehicles();
        }

        console.log("vehicles: " , this.vehicles);
    });
  }

  private fetchVehicles(): void {
    this.movieSubs[4] = this._swapiService.arrayFetch(this.data.vehicles)
      .subscribe((data: any) => {
        console.log("vehicles brah: ", data);
        this.vehicles = data;

        this._cache.cacheAll(this.vehicles, environment.VEHICLE_DICT_KEY);
      });
  }

  //fetches are from api
  private fetchStarships(): void {
    this.movieSubs[3] = this._swapiService.arrayFetch(this.data.starships)
      .subscribe((data: any) => {
        // console.log("Starships brah: ", data);
        this.starships = data; 

        this._cache.cacheAll(this.starships, environment.SHIPS_DICT_KEY);
      }); 
  }

  private fetchSpecies(): void {
    this.movieSubs[2] = this._swapiService.arrayFetch(this.data.species)
      .subscribe((data: any) => {
        // console.log("Species brah: ", data);
        this.species = data;

        this._cache.cacheAll(this.species, environment.SPECIES_DICT_KEY);
      });
  }

  private fetchPlanets(): void {
    this.movieSubs[1] = this._swapiService.arrayFetch(this.data.planets)  
      .subscribe((data: any) => {
        // console.log('planets: ', data);
        this.planets = data;

        this._cache.cacheAll(this.planets, environment.PLANET_DICT_KEY);
      });
  }

  private fetchCharacters(): void {
    this.movieSubs[0] = this._cache.fetch(this.data.characters)
      .subscribe((data: any) => {
          this.characters = data; 
          
          this._cache.cacheAll(this.characters, environment.CHARS_DICT_KEY);
      });
  }

  private async getMovie(): Promise<void> {
    let id = this.parsePath();

    this._storage.getMovie(id).then((result: any) => {
      if(result) {
        this.data = result;
        
        this.getExtraData();
      } else {
        this._toast.presentToast(environment.notFound).then( 
          (res: any) => {
            this.router.navigateByUrl(`/`);
        });
      }
    });
  }

  private parsePath(): number {
    let idx = this.router.url.lastIndexOf('/');
    let id  = this.router.url.slice(idx + 1);
    return parseInt(id);
  }

  private handleData(): void {
    if(this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];
      this.getExtraData();
    } else {
      this.getMovie();
    }
  }

  private getExtraData(): void {
      this.getCharacters();
      // this.getPlanets();
      // this.getSpecies();
      // this.getStarships();
      // this.getVehicles();
  }

  private filterDictionary(dictionary: object, urls: string[]): SWapi[] {
    let arr = [];

    for(let url of urls) {
      if(dictionary[url]) {
        arr.push(dictionary[url]);
      }
    }

    return arr;
  }

  private compareFetch(dictionary: object, arr: any[]): string[] {
    let fetchArr = [];

    for(let a of arr) {
      if(!dictionary[a]) {
        fetchArr.push(a);
      }
    }
    return fetchArr;
  }

  /**
   * Unsubs from subs.
   */
  private unsubscribe(): void {
    for(let i = 0; i < this.movieSubs.length; i++) {
      if(this.movieSubs[i] !== undefined) {
        this.movieSubs[i].unsubscribe();
      }
    }
  }
}