import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  @Input() conversations;
  @Input() convesationsNew: [];
  @Output() onValid: EventEmitter<any> = new EventEmitter();
  @Output() onInserteItem: EventEmitter<any> = new EventEmitter();
  @Output() onAnnule: EventEmitter<any> = new EventEmitter();
  @Input() trigramme: string;
  newConservation: FormControl = new FormControl('');
  // addedConversationList: any[] = [];
  constructor() { }

  ngOnInit(): void {
  }
  onInsert() {
    if (this.newConservation.value.trim().length != 0) {
      // this.addedConversationList.push({ date: new Date().toISOString(), contenu: this.newConservation.value });
      this.onInserteItem.emit({ date: new Date().toISOString(), contenu: this.newConservation.value });
    }

  }
  annuler() {
    this.onAnnule.emit();
  }

}
