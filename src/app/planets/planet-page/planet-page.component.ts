import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//Models
import { Planet } from 'src/app/models/planets.model';

@Component({
  selector: 'app-planet-page',
  templateUrl: './planet-page.component.html',
  styleUrls: ['./planet-page.component.scss'],
})
export class PlanetPageComponent implements OnInit {

  data: Planet

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    if(this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];

      console.log('data: ', this.data);
    }
  }
}
