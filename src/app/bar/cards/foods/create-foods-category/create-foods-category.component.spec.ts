import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFoodsCategoryComponent } from './create-foods-category.component';

describe('CreateFoodsCategoryComponent', () => {
  let component: CreateFoodsCategoryComponent;
  let fixture: ComponentFixture<CreateFoodsCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFoodsCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFoodsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
