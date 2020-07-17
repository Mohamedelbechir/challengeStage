import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientListingPageComponent } from './client-listing-page.component';

describe('ClientListingPageComponent', () => {
  let component: ClientListingPageComponent;
  let fixture: ComponentFixture<ClientListingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientListingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientListingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
