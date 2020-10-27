import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Contact } from '../interfaces/contact.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {

    constructor(private http: HttpClient) { }

    public getContacts(user: string): Observable<Contact[]> {
        return this.http.get<Contact[]>(`${environment.apiPath}/contacts`, {
            params: new HttpParams()
            .set('user', user)
        });
    }

    public setContact(contact: Contact): Observable<Contact> {
        return this.http.post<Contact>(`${environment.apiPath}/contacts`, contact);
    }

    public changeContact(id: number, contact: Contact): Observable<Contact> {
        return this.http.patch<Contact>(`${environment.apiPath}/contacts/${id}`, contact);
    }

    public deleteContact(id: number): Observable<Contact> {
        return this.http.delete<Contact>(`${environment.apiPath}/contacts/${id}`);
    }
    
}
