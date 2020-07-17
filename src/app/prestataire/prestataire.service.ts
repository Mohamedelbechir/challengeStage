import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestataireService {
  url: string = environment.REST_URL;

  constructor(private httpClient: HttpClient) { }
  findAll() {
    return this.httpClient.get(this.url + `/prestataires`);
  }
  find(id: string): Observable<any> {
    return this.httpClient.get(this.url + `prestataires/${id}`);
  }
  findByUrl(urlPresta): Observable<any> {
    return this.httpClient.get(urlPresta);
  }
  save(prestataire): Observable<any> {
    return this.httpClient.post(this.url + 'prestataires', prestataire);
  }
  udpate(prestataire): Observable<any> {
    return this.httpClient.patch(this.url + 'prestataires', prestataire);
  }
}
