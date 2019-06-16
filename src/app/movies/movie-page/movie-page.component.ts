import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//Models
import { FilmsModel } from 'src/app/models/films.model';
//Services
import { StorageService } from 'src/app/services/storage.service';
import { ToastService }   from 'src/app/services/toast.service';
//Env 
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss'],
})
export class MoviePageComponent implements OnInit {

  data: FilmsModel;

  constructor(private route:    ActivatedRoute, 
              private router:   Router,
              private _storage: StorageService,
              private _toast:   ToastService) { }

  ngOnInit() {
    if(this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];
    } else {
      this.getMovie();
    }
  }

  private async getMovie(): Promise<void> {
    let id = this.parsePath();

    this._storage.getMovie(id).then((result: any) => {
      if(result) {
        this.data = result;
      } else {
        this._toast.presentToast(environment.notFound).then(
          (res: any) => {
            this.router.navigateByUrl(`/`);
        });
      }
    });

  }

  private parsePath(): number {
    let idx = this.router.url.lastIndexOf('/');
    let id  = this.router.url.slice(idx + 1);
    return parseInt(id);
  }  
}

