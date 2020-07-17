import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ClientService } from '../client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

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

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
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
    console.log(this.client);
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
  onAnnuleBesoin() {
    this.addedBesoinList = [];
  }
  onValidConvesation() {
    let clientToUpdate = {
      ...this.client,
      conversations: this.addedConversationList.concat(this.client?.conversations ?? []),
    }
    this.clientService.update(clientToUpdate).subscribe(data => {
      console.log(data);
    }, error => console.log(error));

  }
  async onValidBesoin() {
    /** Ajouter les fichier les différents besoins */
    const asyncResBesoins = await this.uploadBesoinFichierAndMap();
    console.log("Apres ajout des fichiers");
    console.log(asyncResBesoins);
    let clientToUpdate = {
      ...this.client,
      // besoins: asyncResBesoins.concat(this.client?.besoins ?? []),
      besoins: [
        ...asyncResBesoins,
        ...(this.client?.besoins as []).map(
          (b: any) => ({
            ...b, sources: (b?.sources as []).map(
              (s: any) => ({ prestataire: s._links.prestataire.href }))
          })),
      ],
    }
    this.clientService.update(clientToUpdate).subscribe(
      data => console.log(data),
      error => console.log(error),
      () => console.log("Les besoins ajouter avec succès")
    );

  }
  /** Ajouter les fichiers des different bésoin et mettre les bons lien des prestaire */
  private async uploadBesoinFichierAndMap() {
    return await Promise.all(this.addedBesoinList.map(async (besoin) => {
      let addedFichier = besoin.appelOffre.fichier ?
        await this.clientService.uplodaFile(besoin.appelOffre.fichier).toPromise()
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



  async onSubmit(value) {
    let urlPlaquetteNewFile = null;
    /** Si Palquette file changer */
    if (this.plaquetteFileChanged) {
      // verifier s'il avait déjà une plaquette
      if (!this.client.plaquette) {
        // ajouter le fichier de la claquette
        urlPlaquetteNewFile = await this.clientService.uplodaFile(this.plaquetteFile).toPromise();

      } else {
        // Supprimer ancien plaquette ajouter un autre
        if (this.client?.plaquette?._links) {
          console.log(`Suppression de l'ancien photo ${this.client?.plaquette?._links?.fichier?.href}`)
          await this.clientService.deleteFichier(this.client?.plaquette?._links?.fichier?.href).toPromise();

        }
        urlPlaquetteNewFile = await this.clientService.uplodaFile(this.plaquetteFile).toPromise();
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
    }, error => console.log(error));
  }


  initForm() {

    this.formClient = this.formBuilder.group({
      /** Partie entreprise */
      nomEnp: [this.entreprise?.nomEnp, [Validators.required]],
      secteur: [this.entreprise?.secteur, [Validators.required]],
      activite: [this.entreprise?.activite, [Validators.required]],
      droits: [this.entreprise?.droits, [Validators.required]],
      adresse: [this.entreprise?.droits, [Validators.required]],
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

  }


  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
