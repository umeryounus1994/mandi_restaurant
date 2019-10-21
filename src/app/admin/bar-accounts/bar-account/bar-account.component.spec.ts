import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarAccountComponent } from './bar-account.component';

describe('BarAccountComponent', () => {
  let component: BarAccountComponent;
  let fixture: ComponentFixture<BarAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
