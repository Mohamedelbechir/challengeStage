import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  url: string = `${environment.REST_URL}/clients`;
  urlFichier: string = `${environment.REST_URL}/fichiers`;

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<any> {
    return this.httpClient.get(this.url);
  }
  update(clientToUpdate: any): Observable<any> {
    console.log("mise à jour client");
    console.log(clientToUpdate);
    return this.httpClient.patch(this.url + `/${clientToUpdate.id}`, clientToUpdate);
  }
 


}
