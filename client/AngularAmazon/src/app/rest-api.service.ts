import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable()
export class RestApiService {
  constructor(private http: HttpClient) {}

  getHeaders() {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set('Authorization', token) : null;
  }
  /**
   * Simple GET resquest to retrieve all the records.
   */
  get(link: string) {
    return this.http
      .get(link, {
        headers: this.getHeaders()
      })
      .toPromise();
  }

  /**
   * GET single data for corresponding ID
   * Two Param Required.
   */
  
  fetch(link: string, id: string) {
    return this.http
      .get(link, {
        headers:
          this.getHeaders() != null
            ? this.getHeaders().set('hashkey', id)
            : null
      })
      .toPromise();
  }
  /**
   * Simple Post Method.
   */
  post(link: string, body: any) {
    return this.http
      .post(link, body, { headers: this.getHeaders() })
      .toPromise();
  }
  /**
   * Simple Post Method.
   */
  put(link: string, body: any) {
    return this.http
      .put(link, body, { headers: this.getHeaders() })
      .toPromise();
  }
}
