// Ng
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
// Ionic
import { IonicModule } from '@ionic/angular';
// Pages
import { CharactersPage } from './characters.page';
// Components
import { CharacterPageComponent } from './character-page/character-page.component';
// Services
import { DataResolverService } from '../resolver/data-resolver.service';
import { CharacterService } from './character.service';

export const routes: Routes = [
  {
    path: '',
    component: CharactersPage
  },
  {
    path: 'character/:id',
    resolve: {
      special: DataResolverService,
    },
    component: CharacterPageComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    CharactersPage,
    CharacterPageComponent,
  ],
  providers: [
    CharacterService,
  ]
})
export class CharactersPageModule {}

