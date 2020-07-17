import { Component, OnInit, Input } from '@angular/core';
import { PrestataireService } from 'src/app/prestataire/prestataire.service';
import { ClientService } from 'src/app/client/client.service';

@Component({
  selector: 'app-besoin-list-item-presta',
  templateUrl: './besoin-list-item-presta.component.html',
  styleUrls: ['./besoin-list-item-presta.component.scss']
})
export class BesoinListItemPrestaComponent implements OnInit {
  @Input() urlPrestaire: string;
  prestataire: any;
  cv: any;

  constructor(private prestataireService: PrestataireService,
    private clientService: ClientService) { }

  ngOnInit(): void {
    this.prestataireService.findByUrl(this.urlPrestaire).subscribe(presta => {

      this.prestataire = presta;
      let cvLink = presta._links.cv?.href;

      this.clientService.findFichier(cvLink).subscribe(
        fichier => this.cv = fichier,
        error => console.log(error),
        () => console.log("chargment cv complet" + this.cv.title)
      );

    }, error => console.log(error));

  }
  onClickPresta() {
    console.log(this.cv.data);
    const linkSource = `data:application/${this.cv.title.split('.')[1] ?? 'png'};base64,${this.cv.monFichier.data}`;
    const downloadLink = document.createElement("a");
    const fileName = this.cv.title;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
