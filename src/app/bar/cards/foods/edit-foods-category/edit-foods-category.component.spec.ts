import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFoodsCategoryComponent } from './edit-foods-category.component';

describe('EditFoodsCategoryComponent', () => {
  let component: EditFoodsCategoryComponent;
  let fixture: ComponentFixture<EditFoodsCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFoodsCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFoodsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
