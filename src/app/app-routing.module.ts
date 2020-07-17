import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { ClientDetailsComponent } from './client/client-details/client-details.component';


const routes: Routes = [
  ...['', 'clients'].map((path) => ({ path, component: ClientComponent })),
  {
    path: 'client-details',
    component: ClientDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
