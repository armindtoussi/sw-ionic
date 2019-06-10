import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//Models
import { SpeciesModel } from 'src/app/models/species.model';

@Component({
  selector: 'app-species-page',
  templateUrl: './species-page.component.html',
  styleUrls: ['./species-page.component.scss'],
})
export class SpeciesPageComponent implements OnInit {

  data: SpeciesModel;

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    if(this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];

      console.log("data: ", this.data);
    }
  }
}
