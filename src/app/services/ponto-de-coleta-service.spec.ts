import { TestBed } from '@angular/core/testing';

import { PontoDeColetaService } from './ponto-de-coleta-service';

describe('PontoDeColetaService', () => {
  let service: PontoDeColetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PontoDeColetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
