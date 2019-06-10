import { Component, OnInit } from '@angular/core';

//Models
import { PlanetsModel } from 'src/app/models/planets.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-planet-page',
  templateUrl: './planet-page.component.html',
  styleUrls: ['./planet-page.component.scss'],
})
export class PlanetPageComponent implements OnInit {

  data: PlanetsModel

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    if(this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];

      console.log('data: ', this.data);
    }
  }

}
