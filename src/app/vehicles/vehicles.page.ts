import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
//Ionic
import { IonInfiniteScroll } from '@ionic/angular';
//RXJS
import { Subscription } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
//Services
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';
//Models
import { Vehicle } from '../models/vehicles.model';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
})
export class VehiclesPage implements OnInit, OnDestroy {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  vehicleSub: Subscription[] = [];
  vehicles: Vehicle[];
  nextUrl: string;
  count: number;

  constructor(private _swapiFetchService: SwapiService,
              private _dataService: DataService,
              private router: Router) { }

  ngOnInit(): void {
    this.getVehicles();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  displayVehicle(vehicle: Vehicle): void {
    console.log("clicked:", vehicle);
    this._dataService.setData(vehicle.name, vehicle);
    this.router.navigateByUrl(`/vehicle/${this.replaceSlashses(vehicle.name)}`);
  }

  loadData(event): void {
    this.vehicleSub[1] = this._swapiFetchService.genericFetch(this.nextUrl)
      .subscribe(
        (results: object) => {
          this.vehicles = this.vehicles.concat(results['results']);
          this.nextUrl = results['next'];
          event.target.complete();

          if(this.vehicles.length === this.count) {
            event.target.disabled = true;
          }
        }
      );
  }

  replaceSlashses(str: string): string {
    return str.replace(/\//g, "-");
  }

  private getVehicles(): void {
    this.vehicleSub[0] = this._swapiFetchService.getVehicles()
      .pipe(
        map(res => {
          this.nextUrl = res['next'];
          this.vehicles = res['results'];
        }),
        map(res => this._swapiFetchService.genericFetch(this.nextUrl)),
        flatMap(res => res),
      ).subscribe(
        (results: object) => {
          this.count = results['count'];
          this.nextUrl = results['next'];
          this.vehicles = this.vehicles.concat(results['results']);

          console.log("Vehicles: ", this.vehicles);
        }
      );
  }

  private unsubscribe(): void {
    for(let i = 0; i < this.vehicleSub.length; i++) {
      if(this.vehicleSub[i] !== undefined) {
        this.vehicleSub[i].unsubscribe();
      }
    }
  }
}
