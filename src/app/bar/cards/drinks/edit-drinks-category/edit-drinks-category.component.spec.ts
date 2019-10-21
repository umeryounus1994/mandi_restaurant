import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDrinksCategoryComponent } from './edit-drinks-category.component';

describe('EditDrinksCategoryComponent', () => {
  let component: EditDrinksCategoryComponent;
  let fixture: ComponentFixture<EditDrinksCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDrinksCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDrinksCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
