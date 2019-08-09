//Services
import { NavListService } from "./nav-list.service";
import { NavItemModel } from '../models/nav-item.model';


describe('NavListService', () => {
    let navlistService: NavListService;
``

    beforeEach(() => {
        navlistService = new NavListService(); 
    });

    it('should be defined (one call)', () => {
        const expected: NavItemModel[] =[ 
            {
                title: 'Home',
                url: '/home',
                icon: 'assets/sw-icons/md-Star_Wars_Storm-Trooper.svg',
            },
            {
                title: 'Movies',
                url: '/movies',
                icon: 'assets/sw-icons/md-Star_Wars_R2D2.svg',
            }, 
            {
                title: 'Characters',
                url: '/characters',
                icon: 'assets/sw-icons/md-Star_Wars_Darth_Vader.svg'
            }, 
            {
                title: 'Planets',
                url: '/planets',
                icon: 'assets/sw-icons/md-Star_Wars_Death_Star.svg'
            }, 
            {
                title: 'Starships',
                url: '/starships',
                icon: '/assets/sw-icons/md-Star_Wars_Falcon.svg'
            }, 
            {
                title: 'Species',
                url: '/species',
                icon: '/assets/sw-icons/md-Star_Wars_C3PO.svg'
            }, 
            {
                title: 'Vehicles',
                url: '/vehicles',
                icon: '/assets/sw-icons/md-Star_Wars_BB8.svg'
            } 
        ]; 

        let list = navlistService.getNavList();

        expect(list).toBeDefined();
    });

    it('should return side drawer nav list(one call)', () => {
        const expected: NavItemModel[] =[ 
            {
                title: 'Home',
                url: '/home',
                icon: 'assets/sw-icons/md-Star_Wars_Storm-Trooper.svg',
            },
            {
                title: 'Movies',
                url: '/movies',
                icon: 'assets/sw-icons/md-Star_Wars_R2D2.svg',
            }, 
            {
                title: 'Characters',
                url: '/characters',
                icon: 'assets/sw-icons/md-Star_Wars_Darth_Vader.svg'
            }, 
            {
                title: 'Planets',
                url: '/planets',
                icon: 'assets/sw-icons/md-Star_Wars_Death_Star.svg'
            }, 
            {
                title: 'Starships',
                url: '/starships',
                icon: '/assets/sw-icons/md-Star_Wars_Falcon.svg'
            }, 
            {
                title: 'Species',
                url: '/species',
                icon: '/assets/sw-icons/md-Star_Wars_C3PO.svg'
            }, 
            {
                title: 'Vehicles',
                url: '/vehicles',
                icon: '/assets/sw-icons/md-Star_Wars_BB8.svg'
            } 
        ]; 

        let list = navlistService.getNavList();

        expect(list).toEqual(expected);
        expect(list).toBeDefined();
    });
});