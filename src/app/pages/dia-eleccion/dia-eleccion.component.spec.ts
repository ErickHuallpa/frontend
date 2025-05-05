import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaEleccionComponent } from './dia-eleccion.component';

describe('DiaEleccionComponent', () => {
  let component: DiaEleccionComponent;
  let fixture: ComponentFixture<DiaEleccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaEleccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiaEleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
