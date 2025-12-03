import { TestBed } from '@angular/core/testing';

import { RuaService } from './rua-service';

describe('RuaService', () => {
  let service: RuaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RuaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
