import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetVaccinesComponent } from './pet-vaccines.component';

describe('PetVaccinesComponent', () => {
  let component: PetVaccinesComponent;
  let fixture: ComponentFixture<PetVaccinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetVaccinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetVaccinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
