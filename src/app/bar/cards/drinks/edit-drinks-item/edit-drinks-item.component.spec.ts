import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDrinksItemComponent } from './edit-drinks-item.component';

describe('EditDrinksItemComponent', () => {
  let component: EditDrinksItemComponent;
  let fixture: ComponentFixture<EditDrinksItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDrinksItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDrinksItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
