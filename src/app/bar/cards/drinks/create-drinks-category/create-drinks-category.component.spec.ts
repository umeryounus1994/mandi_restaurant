import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDrinksCategoryComponent } from './create-drinks-category.component';

describe('CreateDrinksCategoryComponent', () => {
  let component: CreateDrinksCategoryComponent;
  let fixture: ComponentFixture<CreateDrinksCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDrinksCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDrinksCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
