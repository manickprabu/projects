/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FileReaderService } from './file-reader.service';

describe('FileReaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileReaderService]
    });
  });

  it('should ...', inject([FileReaderService], (service: FileReaderService) => {
    expect(service).toBeTruthy();
  }));
});
