import { Component, OnInit } from '@angular/core';

//Ionic
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

//Services
import { NavListService } from './services/nav-list.service';

//Models
import { NavItemModel } from './models/nav-item.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit{
  public appPages: NavItemModel[];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _navListService: NavListService,
  ) {
    this.initializeApp();
  }
  

  ngOnInit(): void {
    this.appPages = this._navListService.getNavList();
    console.log("AppPAges: ", this.appPages);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
