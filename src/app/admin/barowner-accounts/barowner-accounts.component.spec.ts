import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarownerAccountsComponent } from './barowner-accounts.component';

describe('BarownerAccountsComponent', () => {
  let component: BarownerAccountsComponent;
  let fixture: ComponentFixture<BarownerAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarownerAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarownerAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
