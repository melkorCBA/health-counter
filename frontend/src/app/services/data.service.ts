import { IPostData } from 'src/app/models/landing';
import { IFamilyDetails, IBucketDetails } from '../models/data.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  baseUrl: string = 'http://localhost';
  port: string = ':3001';

  constructor(private http: HttpClient) {}

  public post_family_data(postData: IPostData): Observable<any> {
    let json = {
      is_aboard: postData.is_aboard,
      is_patient_contacted: postData.is_patient_contacted,
      n_family_members: postData.n_family_members,
    };

    return this.http
      .post<IFamilyDetails>(this.baseUrl + this.port + '/family/details/', json)
      .pipe(catchError(this.handleError));
  }

  public post_bucket_data(postData: IBucketDetails) {
    let json = {
      id: postData.id,
      gender: postData.gender,
      age_group: postData.age_group,
      cough: postData.cough,
      cold: postData.cold,
      itchy_throat: postData.itchy_throat,
      throat_pain: postData.throat_pain,
      taste_loss: postData.taste_loss
    };

    return this.http
      .post<IBucketDetails>(this.baseUrl + this.port + '/bucket/' + postData.id, json)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
      const errMessage = error.error.message;
      return throwError(errMessage);
      // Use the following instead if using lite-server
      // return Observable.throw(err.text() || 'backend server error');
    }
    return throwError(error.message || error);
  }
}