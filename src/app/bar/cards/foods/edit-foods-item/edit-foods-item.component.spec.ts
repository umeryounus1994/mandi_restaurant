import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFoodsItemComponent } from './edit-foods-item.component';

describe('EditFoodsItemComponent', () => {
  let component: EditFoodsItemComponent;
  let fixture: ComponentFixture<EditFoodsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFoodsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFoodsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
