import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFoodsItemComponent } from './create-foods-item.component';

describe('CreateFoodsItemComponent', () => {
  let component: CreateFoodsItemComponent;
  let fixture: ComponentFixture<CreateFoodsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFoodsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFoodsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
