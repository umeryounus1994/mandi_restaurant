import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarownerAccountComponent } from './barowner-account.component';

describe('BarownerAccountComponent', () => {
  let component: BarownerAccountComponent;
  let fixture: ComponentFixture<BarownerAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarownerAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarownerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
