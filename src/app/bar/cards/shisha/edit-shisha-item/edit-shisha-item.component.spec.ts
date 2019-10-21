import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShishaItemComponent } from './edit-shisha-item.component';

describe('EditShishaItemComponent', () => {
  let component: EditShishaItemComponent;
  let fixture: ComponentFixture<EditShishaItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditShishaItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShishaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
