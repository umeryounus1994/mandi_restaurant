import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBarComponent } from './create-bar.component';

describe('CreateBarComponent', () => {
  let component: CreateBarComponent;
  let fixture: ComponentFixture<CreateBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
