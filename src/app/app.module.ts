import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientComponent } from './client/client.component';
import { HttpClientModule } from '@angular/common/http';
import { ClientDetailsComponent } from './client/client-details/client-details.component';
import { ReactiveFormsModule }  from '@angular/forms';
import { ConversationComponent } from './conversation/conversation.component';
import { BesoinComponent } from './besoin/besoin.component';
import { BesoinListItemPrestaComponent } from './besoin/besoin-list-item-presta/besoin-list-item-presta.component';
import { PrestataireComponent } from './prestataire/prestataire.component';
import { AfficherFichierComponent } from './afficher-fichier/afficher-fichier.component';
@NgModule({
  declarations: [
    AppComponent,
    ClientComponent,
    ClientDetailsComponent,
    ConversationComponent,
    BesoinComponent,
    BesoinListItemPrestaComponent,
    PrestataireComponent,
    AfficherFichierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
