import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, fromEvent, of } from "rxjs";
import { map, filter, debounceTime, switchMap, isEmpty } from "rxjs/operators";
import { FormControl } from '@angular/forms';
import { Client } from 'src/models/client';
import { Source } from 'src/models/source';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, AfterContentInit {

  listClient: any[] = [];
  listClientSearch = [];
  seach_rappel = new FormControl('');
  showRappel: boolean = false;
  showBesoins: boolean = false;
  showPush: boolean = false;

  constructor(private clientService: ClientService, private router: Router) { }

  ngOnInit(): void {
    this.clientService.findAll().subscribe((data) => {
      this.listClient = data._embedded.clients;
    }, error => console.log(error));
  }
  ngAfterContentInit(): void {
    const inputNom: any = document.getElementById('seach_nom');
    const inputRappel: any = document.getElementById('seach_rappel');
    const inputBesoin: any = document.getElementById('seach_besoin');
    const inputPush: any = document.getElementById('seach_push');


    const loadNewList = () => {
      this.listClientSearch =
        this.listClient.filter(c =>
          (this.predicatNom(inputNom.value ?? '', c)) &&
          (this.predicatRappel(inputRappel?.value ?? '', c)) &&
          (this.predicatBesoin(inputBesoin.value ?? '', c)) &&
          (this.predicatPush(inputPush.value ?? '', c))
        );
    }
    fromEvent(inputNom, 'keyup')
      .pipe(
        debounceTime(250), // chercher dans 250ms
        switchMap(e => of(inputNom?.value)))
      .subscribe(v => { loadNewList(); });
    /* fromEvent(inputRappel, 'keyup')
      .pipe(switchMap(e => of(inputRappel?.value)))
      .subscribe(v => { loadNewList(); }); */
    this.seach_rappel.valueChanges.subscribe(
      (value: string) => {
        this.showRappel = true;
        loadNewList();
      }
    );
    fromEvent(inputBesoin, 'keyup')
      .pipe(
        debounceTime(250), // chercher dans 250ms
        switchMap(e => of(inputBesoin.value)))
      .subscribe(v => { this.showBesoins = true; loadNewList(); });
    fromEvent(inputPush, 'keyup')
      .pipe(
        debounceTime(250), // chercher dans 250ms
        switchMap(e => of(inputPush.value)))
      .subscribe(v => { this.showPush = true; loadNewList(); });

  }
  onSelect(client) {
    this.router.navigateByUrl('/client-details', { state: { client: client, nbClient: this.listClient.length } });
  }

  predicatNom = (nom: string, c: any): boolean => nom.length == 0 || c.nom.toLocaleLowerCase() === nom.toLocaleLowerCase();

  predicatRappel = (rappel: Date, c: any): boolean => c?.rappel >= rappel;

  predicatBesoin = (besoin: string, c: any): boolean =>
    besoin.length == 0 || c?.besoins.find(b =>
      b?.description?.toLocaleLowerCase()?.includes(besoin.toLocaleLowerCase())
    );

  predicatPush = (push: string, c: any): boolean =>
    push.length == 0 || c?.pushs?.find(p => p.toLocaleLowerCase() === push.toLocaleLowerCase());


  //searchByName = (name: string): any[] => this.listClient.filter(c => c.nom === name)
  //predicatRappel = (rappel: Date, c: any): boolean => this.listClient.filter(c => c.rappel >= rappel);
  /*   searchByBesoin = (besoin: string): any[] => this.listClient.filter(
      c => c.besoins.find(
        b => b.description === besoin
      )); */
  /* searchByPush = (push: string): any[] => this.listClient.filter(
    c => c.pushs.find(p => p === push)); */

}
