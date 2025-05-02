import { TestBed } from '@angular/core/testing';

import { PartidoPoliticoService } from './partido-politico.service';

describe('PartidoPoliticoService', () => {
  let service: PartidoPoliticoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartidoPoliticoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
