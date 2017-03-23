import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpClientService {

  constructor(private http: Http) { }

  get(url: string) {
    return this.http.get(url)
      .map(response => response.json())
      .catch(this.handleError);
  }

  post(url: string, data: any) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);

    return this.http.post(url, data, {
        headers: headers
      })
      .map(response => response.json())
      .catch(this.handleError);
  }

  private createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic am9lOmJsb2dnc3B3ZA==');
    // headers.append('Content-Type', 'application/json');
  }

  private handleError(errors: any) {
    return Observable.throw(errors.messages);
  }

}
