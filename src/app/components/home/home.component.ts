import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AzureAuthService } from '../../services/azure-auth.service';
import { AppConfigService } from '../../services/app-config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private authService: MsalService, private config: AppConfigService) { }
  logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: this.config.getConfig().postLogoutUrl,
    });
  }
}
