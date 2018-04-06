/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { DocumentService } from './document.service';
import { HttpClientService } from '../../shared/http-client.service';
import { AppConfig } from '../../core/config/app.config';

describe('DocumentService', () => {

  beforeEach(async(() => {
    class AppConfigStub {
      getKey() { }
    }

    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        DocumentService,
        HttpClientService,
        { provide: AppConfig, useClass: AppConfigStub },
        { provide: 'IS_DEV', useValue: true },
      ]
    });
  }));

  it('should...', inject([DocumentService], (service: DocumentService) => {
    expect(service).toBeTruthy();
  }));

});