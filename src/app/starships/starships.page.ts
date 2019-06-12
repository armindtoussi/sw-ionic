import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
//Ionic
import { IonInfiniteScroll } from '@ionic/angular';
//Services
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';
//RXJS
import { Subscription } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
//Models
import { StarshipsModel } from '../models/starships.model';

@Component({
  selector: 'app-starships',
  templateUrl: './starships.page.html',
  styleUrls: ['./starships.page.scss'],
})
export class StarshipsPage implements OnInit, OnDestroy {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  shipSub: Subscription[] = [];
  ships: StarshipsModel[];
  nextUrl: string;
  count: number;

  constructor(private _swapiFetchService: SwapiService,
              private _dataService: DataService,
              private router: Router) { }

  ngOnInit(): void {
    this.getShips();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  displayShip(ship: StarshipsModel): void {
    console.log("Clicked: ", ship);
    this._dataService.setData(ship.name, ship);
    this.router.navigateByUrl(`/starship/${ship.name}`);
  }
  
  loadData(event): void {
    this.shipSub[1] = this._swapiFetchService.genericFetch(this.nextUrl)
      .subscribe(
        (results: object) => {
          this.ships = this.ships.concat(results['results']);
          this.nextUrl = results['next'];
          event.target.complete();

          if(this.ships.length === this.count) {
            event.target.disabled = true;
          }
        }
      );
  }

  private getShips(): void {
    this.shipSub[0] = this._swapiFetchService.getStarships()
      .pipe(
        map(res => {
          this.nextUrl = res['next'];
          this.ships = res['results'];
        }),
        map(res => this._swapiFetchService.genericFetch(this.nextUrl)),
        flatMap(res => res)
      ).subscribe(
        (results: object) => {
          this.count = results['count'];
          this.nextUrl = results['next'];
          this.ships = this.ships.concat(results['results']);

          console.log("Starships: ", this.ships);
        }
      );
  }

  private unsubscribe(): void {
    for(let i = 0; i < this.shipSub.length; i++) {
      if(this.shipSub[i] !== undefined) {
        this.shipSub[i].unsubscribe();
      }
    }
  }
}
