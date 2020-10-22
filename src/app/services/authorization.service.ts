import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {

    private sessionStorage: Storage;

    constructor(private http: HttpClient) { 
        this.sessionStorage = window.sessionStorage;
    }

    public authorization(user: User): Observable<User> {
        return this.http.get<User>(`${environment.apiPath}/users`, {
            params: new HttpParams()
            .set('login', user.login)
            .set('password', user.password)
        }).pipe(
            map(result => result[0])
        );
    }

    public async isAuthenticated() {
        const currentHash = this.sessionStorage.getItem('hash');
        let isExist = false;

        if (currentHash) {
            const users = await this.findUsersByCurrentHash(currentHash).toPromise();

            isExist = Boolean(users.length);
        } 

        return isExist;
    }

    findUsersByCurrentHash(currentHash): Observable<any> {
        return this.http.get(`${environment.apiPath}/users`, {
            params: new HttpParams()
            .set('hash', currentHash)
        });
    }
    
}
