import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDrinksItemComponent } from './create-drinks-item.component';

describe('CreateDrinksItemComponent', () => {
  let component: CreateDrinksItemComponent;
  let fixture: ComponentFixture<CreateDrinksItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDrinksItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDrinksItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
