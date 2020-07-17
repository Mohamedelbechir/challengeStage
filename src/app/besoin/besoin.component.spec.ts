import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BesoinComponent } from './besoin.component';

describe('BesoinComponent', () => {
  let component: BesoinComponent;
  let fixture: ComponentFixture<BesoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BesoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BesoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
