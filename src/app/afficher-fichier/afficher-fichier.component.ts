import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs/internal/types';
import { Fichier } from 'src/models/fichier';

@Component({
  selector: 'app-afficher-fichier',
  templateUrl: './afficher-fichier.component.html',
  styleUrls: ['./afficher-fichier.component.scss']
})
export class AfficherFichierComponent implements OnInit {
  @Input() fichier: Fichier;
  windowOPen: boolean;
  base64TrimmedURL: string;
  generatedImage: string;
  constructor(private domSanitizer: DomSanitizer) {
    this.windowOPen = false;
  }
  ngOnInit(): void {
  }
 

  getImage(imageUrl: string) {
    this.windowOPen = true;
    this.createBlobImageFileAndShow();
   
  }
  /**Method that will create Blob and show in new window */
  createBlobImageFileAndShow(): void {
    this.dataURItoBlob(this.fichier.encodedFichier).subscribe((blob: Blob) => {
      const imageBlob: Blob = blob;
      const imageName: string = this.fichier.libele;
      const imageFile: File = new File([imageBlob], imageName, {
        type: "image/jpeg"
      });
      this.generatedImage = window.URL.createObjectURL(imageFile);
      // on demo image not open window
      if (this.windowOPen) {
        window.open(this.generatedImage);
      }
    });
  }
  /* Method to convert Base64Data Url as Image Blob */
  dataURItoBlob(dataURI: string): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
      const byteString: string = window.atob(dataURI);
      const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: "image/jpeg" });
      observer.next(blob);
      observer.complete();
    });
  }

}
