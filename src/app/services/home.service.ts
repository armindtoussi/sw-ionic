import { Injectable } from '@angular/core';
import { CardModel } from '../models/card.model';


@Injectable({
    providedIn: 'root'
})
export class HomeService {


    readonly cardData: CardModel[] = [
        {
            url: '/movies',
            src: '/assets/sw-films.jpeg',
            alt: 'Star Wars film image card link',
            title: 'Movies',
            description: 'Refresh your Star Wars movie knowledge'
        },
        {
            url: '/characters',
            src: '/assets/sw-people.jpeg',
            alt: 'Star Wars people image card link',
            title: 'Characters',
            description: 'Get information on your favourite Star Wars characters'
        },
        {
            url: '/planets',
            src: '/assets/sw-planets.jpg',
            alt: 'Star Wars planet image card link',
            title: 'Planets',
            description: 'Details on Planets in the Star Wars universe'
        },
        {
            url: '/starships',
            src: '/assets/sw-ships.jpg',
            alt: 'Star Wars ship image card link',
            title: 'Starships',
            description: 'Details and technical specs for Star Wars starships'
        },
        {
            url: '/species',
            src: '/assets/sw-species.jpg',
            alt: 'Star Wars species image card link',
            title: 'Species',
            description: 'Descriptions of a variety of species in the Star Wars universe'
        },
        {
            url: '/vehicles',
            src: '/assets/sw-vehicles.jpg',
            alt: 'Star Wars species image card link',
            title: 'Vehicles',
            description: 'Details and technical specs for Star Wars vehicles'
        }
    ];

    constructor() { }

    getCardData(): CardModel[] {
        return this.cardData;
    }
}
