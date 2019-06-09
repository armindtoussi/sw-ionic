import { Component, OnInit } from '@angular/core';

//Models
import { FilmsModel } from 'src/app/models/films.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss'],
})
export class MoviePageComponent implements OnInit {

  data: FilmsModel;

  constructor(private route: ActivatedRoute, 
              private router: Router) { }

  ngOnInit() {
    if(this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];
    }
  }

}
