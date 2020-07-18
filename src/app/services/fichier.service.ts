import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FichierService {
  url = `${environment.REST_URL}/fichiers`;

  constructor(private httpClient: HttpClient) { }

  uplodaFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('fichier', file);
    formData.append('title', file.name);
    return this.httpClient.post(this.url, formData);
  }
  findByUrl(urlFichier: string): Observable<any> {
    return this.httpClient.get(urlFichier);
  }
  findById(idFichier: string): Observable<any> {
    return this.httpClient.get(`${this.url}/${idFichier}`);
  }
  deleteFichier(urlFile: string): Observable<any> {
    return this.httpClient.delete(urlFile);
  }

}
