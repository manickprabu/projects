import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AppConfig } from '../../core/config/app.config';
import { HttpClientService } from '../../shared/http-client.service';

@Injectable()
export class DocumentService {

  constructor(private appConfig: AppConfig,
              private httpClientService: HttpClientService) { }

  getDocTypes(): Observable<String[]> {
    const url = this.appConfig.getKey('docTypes', {});
    return this.httpClientService.get(url);
  }

  getMetaDataFields(docType: String): Observable<any[]> {
    const url = this.appConfig.getKey('metaDataFields', { formId: docType });
    return this.httpClientService.get(url);
  }

  postDocument(caseId: string, formData: FormData): Observable<any[]> {
    const url = this.appConfig.getKey('uploadDocument', { caseId: caseId });
    return this.httpClientService.post(url, formData);
  };

}
