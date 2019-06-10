import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//Models
import { CharacterModel } from 'src/app/models/character.model';


@Component({
  selector: 'app-character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.scss'],
})
export class CharacterPageComponent implements OnInit {

  data: CharacterModel;

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    if(this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];

      console.log("DATA; ", this.data);
    }
  }

}
