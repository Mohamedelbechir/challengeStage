import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BesoinListItemPrestaComponent } from './besoin-list-item-presta.component';

describe('BesoinListItemPrestaComponent', () => {
  let component: BesoinListItemPrestaComponent;
  let fixture: ComponentFixture<BesoinListItemPrestaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BesoinListItemPrestaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BesoinListItemPrestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
