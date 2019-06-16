import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//Models
import { Film } from 'src/app/models/films.model';
//Services
import { StorageService } from 'src/app/services/storage.service';
import { ToastService }   from 'src/app/services/toast.service';
import { SwapiService } from 'src/app/services/swapi.service';

//Env 
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss'],
})
export class MoviePageComponent implements OnInit {

  data: Film;

  constructor(private route:    ActivatedRoute, 
              private router:   Router,
              private _storage: StorageService,
              private _toast:   ToastService,
              private _swapiService: SwapiService) { }

  ngOnInit() {
    this.handleData();
  }

  private getCharacters(): void {
    // todo - we need to check first if the characaters are cached or not. 
    // this._storage.addCharacter(this.data.characters[i]);
    
    this._swapiService.arrayFetch(this.data.characters)
      .subscribe(
        (data: any) => {
          console.log("Characteer fetch: ", data);
          //Cache existing data here. 
        }
      );
  }

  private async getMovie(): Promise<void> {
    let id = this.parsePath();

    this._storage.getMovie(id).then((result: any) => {
      if(result) {
        this.data = result;
        
        this.getCharacters();
      } else {
        this._toast.presentToast(environment.notFound).then(
          (res: any) => {
            this.router.navigateByUrl(`/`);
        });
      }
    });
  }

  private cacheCharacters(): void {

  }

  private parsePath(): number {
    let idx = this.router.url.lastIndexOf('/');
    let id  = this.router.url.slice(idx + 1);
    return parseInt(id);
  }  

  private handleData(): void {
    if(this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];
      this.getCharacters();
    } else {
      this.getMovie();
    }
  }
}

