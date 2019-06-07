import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule }   from '@angular/common/http';
//Ionic
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

//Component/config
import { AppComponent }     from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Services.
import { NavListService } from './services/nav-list.service';
import { SwapiService }   from './services/swapi.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NavListService,
    SwapiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
