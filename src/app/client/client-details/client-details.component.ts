import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { ClientService } from 'src/app/services/client.service';
import { FichierService } from 'src/app/services/fichier.service';
import { BesoinUpdateModel, BesoinComponent } from 'src/app/besoin/besoin.component';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit, OnDestroy {



  client: any;
  nbClient: number;
  formClient: FormGroup;
  listConvesation: any;
  listBesoinUpdated: BesoinUpdateModel[] = [];
  listBesoin: any;
  addedConversationList = [];
  addedBesoinList = [];
  trigramme: string;
  plaquetteFile: File | null = null;
  plaquetteFileChanged = false;

  push1Options = ['push1.1', 'push1.2', 'push1.3', 'push1.4', 'push1.5'];
  push2Options = ['push2.1', 'push2.2', 'push2.3', 'push2.4', 'push2.5'];
  push3Options = ['push3.1', 'push3.2', 'push3.3', 'push3.4', 'push3.5'];
  push4Options = ['push4.1', 'push4.2', 'push4.3', 'push4.4', 'push4.5'];
  push5Options = ['push5.1', 'push5.2', 'push5.3', 'push5.4', 'push5.5'];
  push6Options = ['push6.1', 'push6.2', 'push6.3', 'push6.4', 'push6.5'];
  push7Options = ['push7.1', 'push7.2', 'push7.3', 'push7.4', 'push7.5'];
  push8Options = ['push8.1', 'push8.2', 'push8.3', 'push8.4', 'push8.5'];
  mySubscription: Subscription;

  @ViewChild('componentBesoin') componentBesoin: BesoinComponent;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private fichierService: FichierService,
    private formBuilder: FormBuilder,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit(): void {
    /*  this.activatedRoute.queryParams.subscribe(params => this.id = params['id']);
     this.clientService.findAll */
    this.client = history.state.client;
    this.nbClient = history.state.nbClient
    this.initForm();
    this.listConvesation = (this.client.conversations as [])?.slice();
    this.listBesoin = (this.client.besoins as [])?.slice();
    this.trigramme = this.client?.nom?.charAt(0) + this.client?.prenom?.charAt(0) + this.client?.prenom?.charAt(1)?.toUpperCase();

  }

  onInsertConvesation(conversation) {
    this.addedConversationList.push(conversation);
  }

  onAnnuleConversation() {
    this.addedConversationList = [];
  }
  onInsertBesoin(besoin) {
    this.addedBesoinList.push(besoin)
  }
  onUpdateBesoin(besoin: BesoinUpdateModel) {
    let existedBesoin = this.listBesoinUpdated.find(b => b.index == besoin.index);
    if (existedBesoin) { // il a déjà été modifier
      existedBesoin.etatOffre = besoin.etatOffre ?? existedBesoin.etatOffre;
      existedBesoin.fichier = besoin.fichier ?? existedBesoin.fichier;
      existedBesoin.index = besoin.index ?? existedBesoin.index;
      existedBesoin.statut = besoin.statut ?? existedBesoin.statut;
      console.log(`Déjà modifier`)
      console.log(existedBesoin)
    } else {
      console.log(`Nouveau`)
      console.log(besoin)
      this.listBesoinUpdated.push(besoin);
    }
  }
  onAnnuleBesoin() {
    this.addedBesoinList = [];
    this.listBesoinUpdated = [];
  }
  onValidConvesation() {
    let clientToUpdate = {
      ...this.client,
      conversations: this.addedConversationList.concat(this.client?.conversations ?? []),
    }
    this.clientService.update(clientToUpdate).subscribe(data => {
      console.log(data);
      this.client = data;
      alert('Nodification effectuée')
    }, error => console.log(error));

  }
  async onValidBesoin() {

    /** Ajouter les fichiers les différents besoins */
    const asyncResBesoins = await this.uploadBesoinFichierAndMap();
    const besoinChangedAndMapped = await this.updaodBesoinfichierAndUpdateAndMap();
    console.log("Apres ajout des fichiers");
    console.log(asyncResBesoins);
    let clientToUpdate = {
      ...this.client,
      // besoins: asyncResBesoins.concat(this.client?.besoins ?? []),
      besoins: [
        ...asyncResBesoins,
        ...besoinChangedAndMapped, // les besoins anciens qui ont été modifiés
        ...(this.client?.besoins as []) // Filter liste anciennes pour enveller les bésoins modofiés
          .filter((b, index) => this.listBesoinUpdated.length == 0 || this.listBesoinUpdated.find((bup) => index != bup.index))
          .map( // mapper les anciens bésoins
            (b: any) => ({
              ...b, sources: (b?.sources as []).map(
                (s: any) => ({ prestataire: s._links.prestataire.href }))
            })),
      ],
    }
    this.clientService.update(clientToUpdate).subscribe(
      data => {
        console.log(data);
        this.client = data;
        this.onAnnuleBesoin();
        alert('Nodification effectuée')
      },
      error => console.log(error),
      () => console.log("Les besoins ajouté avec succès")
    );

  }
  /** Ajouter les fichiers des differents bésoins et mettre les bons liens des prestataire */
  private async uploadBesoinFichierAndMap() {
    return await Promise.all(this.addedBesoinList.map(async (besoin) => {
      let addedFichier = besoin.appelOffre.fichier ?
        await this.fichierService.uplodaFile(besoin.appelOffre.fichier).toPromise()
        : null;
      return {
        ...besoin,
        appelOffre: {
          etatOffre: besoin.appelOffre.etatOffre,
          fichier: addedFichier ? `${environment.REST_URL}/fichiers/${addedFichier.id}` : null,
        }
      };
    }));
  }
  async updaodBesoinfichierAndUpdateAndMap() {
    /** chercher les besoins aciens doivent être modifier */
    /*   let besoinChanged = this.listBesoin?.filter(
        (b, index) => this.listBesoinUpdated.find(bup => bup.index == index)
      ); */
    const besoinChanged = this.listBesoinUpdated.map(
      bup => ({ nouveau: bup, ancien: this.listBesoin.find((b, index) => index == bup.index) })
    );
    /* Supprimer ancien Fichier si on a un nouveau */
    const besoinChangedFichierUp = await Promise.all(besoinChanged.map(async (b) => {
      let addedFichier;
      if (b.nouveau.fichier) {
        addedFichier = await this.fichierService.uplodaFile(b.nouveau.fichier).toPromise();
        if (b.ancien?.appelOffre?._links?.fichier) { // supprimer ancien fichier
          await this.fichierService.deleteFichier(b.ancien?.appelOffre?._links?.fichier?.href).toPromise();
        }
      }
      return {
        ...b.ancien,
        statut: b.nouveau.statut ?? b.ancien?.statut,
        appelOffre: {
          etatOffre: b.nouveau.etatOffre ?? b.ancien?.appelOffre?.etatOffre,
          fichier: addedFichier ?
            `${environment.REST_URL}/fichiers/${addedFichier.id}` : b.ancien?.appelOffre?._links?.fichier?.href ?? null,
        },
        sources: [
          {
            prestataire: b.nouveau.urlPrestataire ?? b.ancien.sources[0]._links.prestataire.href
          }
        ]
      };
    }));
    return besoinChangedFichierUp;
  }



  async onSubmit(value) {
    let urlPlaquetteNewFile = null;
    /** Si Palquette file changer */
    if (this.plaquetteFileChanged) {
      // verifier s'il avait déjà une plaquette
      if (!this.client.plaquette) {
        // ajouter le fichier de la plaquette
        urlPlaquetteNewFile = await this.fichierService.uplodaFile(this.plaquetteFile).toPromise();

      } else {
        // Supprimer ancienne plaquette et  ajouter un autre
        if (this.client?.plaquette?._links) {
          console.log(`Suppression de l'ancien photo ${this.client?.plaquette?._links?.fichier?.href}`)
          await this.fichierService.deleteFichier(this.client?.plaquette?._links?.fichier?.href).toPromise();

        }
        urlPlaquetteNewFile = await this.fichierService.uplodaFile(this.plaquetteFile).toPromise();
      }

    }

    /** Ajouter les fichier les différents besoins */
    const asyncResBesoins = await this.uploadBesoinFichierAndMap();


    let clientToUpdate = {
      ...this.client,
      nom: value.nom,
      prenom: value.prenom,
      statut: value.statut,
      rappel: value.rappel,
      titre: value.titre,
      email: value.email,
      telephoneU: value.telephoneU,
      telephoneD: value.telephoneD,
      telephoneM: value.telephoneM,
      linkedIn: value.linkedIn,
      observation: value.observation,
      techOutils: value.techOutils,
      // pushs:[value.push],
      //plaquette: value.droits,
      conversations: this.addedConversationList.concat(this.client?.conversations ?? []),
      besoins: [
        ...asyncResBesoins,
        ...(this.client?.besoins ?? [])?.map(
          (b: any) => ({
            ...b, sources: (b?.sources as []).map(
              (s: any) => ({ prestataire: s._links.prestataire.href }))
          })),
      ], // les besoins 
      entreprise: {
        nomEnp: value.nomEnp,
        secteur: value.secteur,
        activite: value.activite,
        droits: value.droits,
        adresse: value.adresse,
        codePostale: value.codePostale,
        ville: value.ville,
        notes: value.notes,
        telephoneEnpU: value.telephoneEnpU,
        telephoneEnpD: value.telephoneEnpD,
        precisions: value.precisions,
        emailEnp: value.emailEnp,
        linkedInEnp: value.linkedInEnp,

      },
      pushs: [value.push1, value.push2, value.push3, value.push4,
      value.push5, value.push6, value.push7, value.push8]
        .filter(p => (p && p.lenght != 0)),
      plaquette: {
        date: value.datePlaquette,
        libele: this.plaquetteFile?.name ?? this.client?.plaquette?.libele,
        fichier: this.plaquetteFile ?
          `${environment.REST_URL}/fichiers/${urlPlaquetteNewFile.id}`
          : this.client?.plaquette?._links?.fichier?.href
      }

    };
    this.clientService.update(clientToUpdate).subscribe(data => {
      console.log(data);
      this.client = data
      alert('Nodification effectuée')
    }, error => console.log(error));
  }


  initForm() {

    this.formClient = this.formBuilder.group({
      /** Partie entreprise */
      nomEnp: [this.entreprise?.nomEnp, [Validators.required]],
      secteur: [this.entreprise?.secteur, [Validators.required]],
      activite: [this.entreprise?.activite, [Validators.required]],
      droits: [this.entreprise?.droits, [Validators.required]],
      adresse: [this.entreprise?.adresse, [Validators.required]],
      codePostale: [this.entreprise?.codePostale, [Validators.required]],
      ville: [this.entreprise?.ville, [Validators.required]],
      notes: [this.entreprise?.notes,],
      telephoneEnpU: [this.entreprise?.telephoneEnpU,],
      telephoneEnpD: [this.entreprise?.telephoneEnpD,],
      precisions: [this.entreprise?.precisions,],
      emailEnp: [this.entreprise?.emailEnp,],
      linkedInEnp: [this.entreprise?.linkedInEnp,],
      /** Partie contact */
      nom: [this.client?.nom, [Validators.required]],
      prenom: [this.client?.prenom, [Validators.required]],
      statut: [this.client?.statut, [Validators.required]],
      rappel: [this.client?.rappel, [Validators.required]],
      titre: [this.client?.titre, [Validators.required]],
      email: [this.client?.email, [Validators.required]],
      telephoneU: [this.client?.telephoneU, [Validators.required]],
      telephoneD: [this.client?.telephoneD, [Validators.required]],
      telephoneM: [this.client?.telephoneM, [Validators.required]],
      linkedIn: [this.client?.linkedIn, [Validators.required]],
      observation: [this.client?.observation, [Validators.required]],
      techOutils: [this.client?.techOutils, [Validators.required]],
      // pushs: [''], // ! une liste de valeurs
      push1: [this.getDefaultPush(this.push1Options)],
      push2: [this.getDefaultPush(this.push2Options)],
      push3: [this.getDefaultPush(this.push3Options)],
      push4: [this.getDefaultPush(this.push4Options)],
      push5: [this.getDefaultPush(this.push5Options)],
      push6: [this.getDefaultPush(this.push6Options)],
      push7: [this.getDefaultPush(this.push7Options)],
      push8: [this.getDefaultPush(this.push8Options)],
      // plaquette: [''], // !DOTO: verifier apres
      //conversations: ['']
      //besoins: ['']
      datePlaquette: [this.client?.plaquette?.date ?? null],
      fichierPlaquette: ['']


    });
  }
  get entreprise() {
    return this.client.entreprise;
  }
  emitPlaquetteFiles(event) {
    const file = event.target.files[0];
    this.plaquetteFile = file;
    this.plaquetteFileChanged = true;

  }
  get getPlaquetteLibele() {
    if (this.plaquetteFileChanged)
      return this.plaquetteFile.name;
    else return this.client?.plaquette?.libele;
  }
  getDefaultPush = (options: any[]) =>
    options.find(p => (this.client?.pushs?.find(cp => cp === p)));


  annuler() {
    this.addedConversationList = [];
    this.addedBesoinList = [];
    this.listBesoinUpdated = [];
  }



  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
