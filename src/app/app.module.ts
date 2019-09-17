import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Ionic
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// Component/config
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Services.
import { NavListService } from './services/nav-list.service';
import { SwapiService } from './services/swapi.service';
import { DataService } from './services/data.service';
import { StorageService } from './services/storage.service';
import { ToastService } from './services/toast.service';
import { CacheService } from './services/cache.service';
// Modules.
import { MoviesPageModule } from './movies/movies.module';
import { PlanetsPageModule } from './planets/planets.module';
import { CharactersPageModule } from './characters/characters.module';
import { SpeciesPageModule } from './species/species.module';
import { StarshipsPageModule } from './starships/starships.module';
import { VehiclesPageModule } from './vehicles/vehicles.module';
import { HomeService } from './services/home.service';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    MoviesPageModule,
    PlanetsPageModule,
    CharactersPageModule,
    SpeciesPageModule,
    StarshipsPageModule,
    VehiclesPageModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NavListService,
    SwapiService,
    DataService,
    StorageService,
    CacheService,
    ToastService,
    HomeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
