import { Injectable } from '@angular/core';
import { NavItemModel } from '../models/nav-item.model';

@Injectable()
export class NavListService {

    readonly navList: NavItemModel[] = [ 
        {
            title: 'Home',
            url: '/home',
            icon: 'home'
        },
        {
            title: 'Movies',
            url: '/movies',
            icon: 'videocam',
        }, 
        {
            title: 'Characters',
            url: '/characters',
            icon: 'people'
        }, 
        {
            title: 'Planets',
            url: '/planets',
            icon: 'planet'
        }, 
        {
            title: 'Starships',
            url: '/starships',
            icon: 'rocket'
        }, 
        {
            title: 'Species',
            url: '/species',
            icon: 'paw'
        }, 
        {
            title: 'Vehicles',
            url: '/vehicles',
            icon: 'car'
        } 
    ];

    constructor() { }

    getNavList(): NavItemModel[] {
        return this.navList;
    }
}