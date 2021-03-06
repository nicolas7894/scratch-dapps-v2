import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CreateGameComponent } from './pages/create-game/create-game.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailsGameComponent } from './pages/details-game/details-game.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogAddLiquididtyComponent } from './pages/details-game/dialog-add-liquididty/dialog-add-liquididty.component';
import { DialogPlayGameComponent } from './pages/details-game/dialog-play-game/dialog-play-game.component';
import { CodeInputModule } from 'angular-code-input';
import { InvestorsComponent } from './pages/investors/investors.component';
import { DialogRemoveLiquidityComponent } from './pages/investors/dialog-remove-liquidity/dialog-remove-liquidity.component';
import {AddressPipe} from './pipes/address.pipe';
import {ToastrModule} from 'ngx-toastr';
import { CardGameComponent } from './components/card-game/card-game.component';
import { LandingComponent } from './pages/landing/landing.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    CreateGameComponent,
    DetailsGameComponent,
    DialogAddLiquididtyComponent,
    DialogPlayGameComponent,
    InvestorsComponent,
    DialogRemoveLiquidityComponent,
    AddressPipe,
    CardGameComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MatDialogModule,
    AppRoutingModule,
    CodeInputModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
