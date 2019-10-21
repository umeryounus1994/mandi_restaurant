import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShishaCategoryComponent } from './edit-shisha-category.component';

describe('EditShishaCategoryComponent', () => {
  let component: EditShishaCategoryComponent;
  let fixture: ComponentFixture<EditShishaCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditShishaCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShishaCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
