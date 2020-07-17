import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PrestataireService } from '../prestataire/prestataire.service';

@Component({
  selector: 'app-besoin',
  templateUrl: './besoin.component.html',
  styleUrls: ['./besoin.component.scss']
})
export class BesoinComponent implements OnInit {

  @Input() besoins = [];
  @Input() besoinsNew = [];
  @Output() onValid: EventEmitter<any> = new EventEmitter();
  @Output() onAnnule: EventEmitter<any> = new EventEmitter();
  @Output() onInserteItem: EventEmitter<any> = new EventEmitter();

  prestataires: any;

  file: File | null = null;
  description = new FormControl('', [Validators.required]);
  statut = new FormControl('encours');
  etatOffre = new FormControl('attente');
  urlPrestataire = new FormControl('', [Validators.required]);
  dateEnvoie = new FormControl('', [Validators.required]);


  constructor(
    private prestataireService: PrestataireService) { }

  ngOnInit(): void {
    this.prestataireService.findAll().subscribe((prsts: any) => {
      this.prestataires = prsts?._embedded?.prestataires;
    }, error => console.log(error))
  }

  onInsert() {
    if (this.formNotEmpy()) {
      let besoin = {
        date: new Date().toISOString(),
        description: this.description.value,
        statut: this.statut.value,
        appelOffre: {
          etatOffre: this.etatOffre.value,
          fichier: this.file
        },
        sources: [
          { prestataire: this.urlPrestataire.value }
        ],
        dateEnvoie: this.dateEnvoie.value
      }

      this.onInserteItem.emit(besoin);
    }

  }
  formNotEmpy() {
    return (
      this.description.value.trim().length != 0 &&
      this.statut.value.trim().length != 0 &&
      this.etatOffre.value.trim().length != 0 &&
      this.urlPrestataire.value.trim().length != 0
    );
  }

  emitFiles(event) {
    const file = event.target.files[0];
    this.file = file;
  }

  /*  initForm() {
     this.formBesoin = this.formBuilder.group({
       description: ['', Validators.required],
       statut: ['', Validators.required],
       etatOffre: ['', Validators.required],
       fichier: [null]
 
     });
   } */
}
