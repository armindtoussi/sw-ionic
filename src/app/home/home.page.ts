import { Component, OnInit } from '@angular/core';
// Services
import { HomeService } from '../services/home.service';
// Models
import { CardModel } from '../models/card.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  cards: CardModel[];

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.cards = this.homeService.getCardData();
  }
}
