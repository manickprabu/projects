/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BaseRequestOptions, HttpModule, Http, Response, ResponseOptions} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { HttpClientService } from './http-client.service';

describe('HttpServiceService', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        BaseRequestOptions,
        MockBackend,
        HttpClientService,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });

  }));

  function setupConnections(mockBackend: MockBackend, options: any) {
    mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(options)
        })));
      });
  }

  it('.get() should return data', 
    inject([HttpClientService, MockBackend], (httpService: HttpClientService, mockBackend: MockBackend) => {
    
    setupConnections(mockBackend, [
        {
            'name':'caseid',
            'value':'case123',
            'operatio':'EQUALS'
        },
        {
            'name':'contentType',
            'value':'pdf',
            'operation':'EQUALS'
        }
      ]);

      httpService.get('').subscribe((data) => {
        expect(data.length).toBe(2);
        expect(data[0].name).toEqual('caseid');
      });

  }));

  it('.post() should post data object and return data', 
    inject([HttpClientService, MockBackend], (httpService: HttpClientService, mockBackend: MockBackend) => {
    
    setupConnections(mockBackend, [
        {
            'name':'caseid',
            'value':'case123',
            'operatio':'EQUALS'
        },
        {
            'name':'contentType',
            'value':'pdf',
            'operation':'EQUALS'
        }
      ]);

      httpService.post('', {}).subscribe((data) => {
        expect(data.length).toBe(2);
        expect(data[0].name).toEqual('caseid');
      });

  }));

});
