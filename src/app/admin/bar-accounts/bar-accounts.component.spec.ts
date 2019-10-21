import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarAccountsComponent } from './bar-accounts.component';

describe('BarAccountsComponent', () => {
  let component: BarAccountsComponent;
  let fixture: ComponentFixture<BarAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
