import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateGameComponent } from './pages/create-game/create-game.component';
import { DetailsGameComponent } from './pages/details-game/details-game.component';
import { InvestorsComponent } from './pages/investors/investors.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'new-game', component: CreateGameComponent },
  { path: 'details-game/:address', component: DetailsGameComponent },
  { path: 'investors', component: InvestorsComponent },

  { path: '',   redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
