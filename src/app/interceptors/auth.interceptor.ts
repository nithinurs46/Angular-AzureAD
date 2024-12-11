import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private msalService: MsalService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // The scopes you need for the token
    const requestScopes = {
      scopes: ["user.Read"]  // Replace with your API's required scopes
    };
    let account;
    const accounts = this.msalService.instance.getAllAccounts();
    if (accounts != null && accounts.length === 0) {
      console.log('No accounts available, logging in');
      this.msalService.instance.loginRedirect();
    } else {
      this.msalService.instance.setActiveAccount(accounts[0]);
      account = accounts[0];
    }
    if (!account) {
      return next.handle(request);
    }
    // Try to acquire the token silently
    return this.msalService.acquireTokenSilent(requestScopes)
      .pipe(
        switchMap((response: any) => {
          const token = response.accessToken;
          const authReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(authReq);
        })
      );
  }
}
