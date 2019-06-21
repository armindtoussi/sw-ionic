import { Component, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicles.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vehicles-page',
  templateUrl: './vehicles-page.component.html',
  styleUrls: ['./vehicles-page.component.scss'],
})
export class VehiclesPageComponent implements OnInit {

  data: Vehicle;

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    if(this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];

      console.log("Data: ", this.data);
    }
  }

}
