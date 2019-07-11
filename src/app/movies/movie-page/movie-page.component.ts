import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
//Ionic
import { ModalController } from '@ionic/angular';
//Models
import { Film }      from 'src/app/models/films.model';
import { Character } from 'src/app/models/character.model';
import { Planet }    from 'src/app/models/planets.model';
import { Species }   from 'src/app/models/species.model';
import { Starship }  from 'src/app/models/starships.model';
import { Vehicle }   from 'src/app/models/vehicles.model';
//Services
import { ToastService }   from 'src/app/services/toast.service';
import { CacheService } from 'src/app/services/cache.service';
//RXJS
import { Subscription } from 'rxjs';
//Env 
import { environment } from 'src/environments/environment';
//Modal
import { CrawlModalPage } from '../crawl-modal/crawl-modal.page';


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

  constructor(private route:     ActivatedRoute, 
              private router:    Router,
              private _toast:    ToastService,
              private _cache:    CacheService,
              private modalCtrl: ModalController) { }

  ngOnInit(): void {
    this.movieSubs = [];
    this.handleData();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  navToElementPage(id: string, segment: string): void {
    if(id && segment) {
      this.router.navigateByUrl(`/${segment}/${id}`);
    } else {
      this._toast.presentToast(environment.notFound)
        .then((res: any) => {
          this.router.navigateByUrl(`/`);
      });
    }
  }

  async presentCrawlModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CrawlModalPage,
      componentProps: {
        'crawl': this.data.opening_crawl,
        'id': this.data.episode_id,
        'title': this.data.title,
      }
    });

    return await modal.present();
  }

  private fetchVehicles(): void {
    if(this.data.vehicles.length === 0) {
      return; 
    }

    this.movieSubs[4] = this._cache.fetch(this.data.vehicles)
      .subscribe((data: any) => {
        this.vehicles = data;
      });
  }

  //fetches are from api
  private fetchStarships(): void {
    if(this.data.starships.length === 0) {
      return;
    }

    this.movieSubs[3] = this._cache.fetch(this.data.starships)
      .subscribe((data: any) => {
        this.starships = data; 
      }); 
  }

  private fetchSpecies(): void {
    if(this.data.species.length === 0) {
      return; 
    }

    this.movieSubs[2] = this._cache.fetch(this.data.species)
      .subscribe((data: any) => {
        this.species = data;
      });
  }

  private fetchPlanets(): void {
    if(this.data.planets.length === 0) {
      return;
    }

    this.movieSubs[1] = this._cache.fetch(this.data.planets)  
      .subscribe((data: any) => {
        this.planets = data;
      });
  }

  private fetchCharacters(): void {
    if(this.data.characters.length === 0) {
      return;
    }

    this.movieSubs[0] = this._cache.fetch(this.data.characters)
      .subscribe((data: any) => {
          this.characters = data; 
      });
  }

  private async getMovie(): Promise<void> {
    let id = this.parsePath();

    await this._cache.fetchSingleEntry(id, environment.MOVIES_KEY, 'episode_id')
      .then((result) => {
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
      this.fetchCharacters();
      this.fetchPlanets();
      this.fetchSpecies();
      this.fetchStarships();
      this.fetchVehicles();
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