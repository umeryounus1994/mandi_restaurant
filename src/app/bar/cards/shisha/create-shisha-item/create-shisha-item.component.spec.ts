import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShishaItemComponent } from './create-shisha-item.component';

describe('CreateShishaItemComponent', () => {
  let component: CreateShishaItemComponent;
  let fixture: ComponentFixture<CreateShishaItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateShishaItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShishaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
