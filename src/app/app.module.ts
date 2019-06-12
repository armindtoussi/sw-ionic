import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule }   from '@angular/common/http';
//Ionic
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar }    from '@ionic-native/status-bar/ngx';

//Component/config
import { AppComponent }     from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Services.
import { NavListService } from './services/nav-list.service';
import { SwapiService }   from './services/swapi.service';
import { DataService }    from './services/data.service';

//Modules.
import { MoviesPageModule }     from './movies/movies.module';
import { PlanetsPageModule }    from './planets/planets.module';
import { CharactersPageModule } from './characters/characters.module';
import { SpeciesPageModule } from './species/species.module';
import { StarshipsPageModule } from './starships/starships.module';
import { VehiclesPageModule } from './vehicles/vehicles.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    MoviesPageModule,
    PlanetsPageModule,
    CharactersPageModule,
    SpeciesPageModule,
    StarshipsPageModule,
    VehiclesPageModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NavListService,
    SwapiService,
    DataService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
