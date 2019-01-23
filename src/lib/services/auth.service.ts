import {Injectable} from '@angular/core';

@Injectable()
export class AuthService {

    private storage: Storage;

    constructor() {
        this.storage = localStorage;
    }

    setOneTimeToken(token: string): void {
        this.storage.setItem('one_time_token', token);
    }

    unsetOneTimeToken(): void {
        this.storage.removeItem('one_time_token');
    }

    getOneTimeToken(): string {
        return this.storage.getItem('access_token');
    }

    isAuthenticated(): boolean {
        return (this.storage.getItem('access_token') !== null);
    }

    setAccessToken(token: string): void {
        this.storage.setItem('access_token', token);
    }

    unsetAccessToken(): void {
        this.storage.removeItem('access_token');
    }

    getAccessToken(): string {
        return this.storage.getItem('access_token');
    }
}
