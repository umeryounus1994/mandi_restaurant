import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShishaCategoryComponent } from './create-shisha-category.component';

describe('CreateShishaCategoryComponent', () => {
  let component: CreateShishaCategoryComponent;
  let fixture: ComponentFixture<CreateShishaCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateShishaCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShishaCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
