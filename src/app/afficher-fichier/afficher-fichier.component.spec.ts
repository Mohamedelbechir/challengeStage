import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherFichierComponent } from './afficher-fichier.component';

describe('AfficherFichierComponent', () => {
  let component: AfficherFichierComponent;
  let fixture: ComponentFixture<AfficherFichierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfficherFichierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfficherFichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
