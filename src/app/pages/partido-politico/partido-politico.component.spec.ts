import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidoPoliticoComponent } from './partido-politico.component';

describe('PartidoPoliticoComponent', () => {
  let component: PartidoPoliticoComponent;
  let fixture: ComponentFixture<PartidoPoliticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartidoPoliticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartidoPoliticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
