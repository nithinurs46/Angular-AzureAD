import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, filter, takeUntil } from 'rxjs';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { AzureAuthService } from './services/azure-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Azure-AD';
  isUserLoggedIn: boolean = false;
  private readonly _destroy = new Subject<void>();
  user!: string;

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalBroadcastService: MsalBroadcastService,
    private authService: MsalService, private azureAuthService: AzureAuthService) {
  }

  ngOnInit(): void {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (interactionStatus: InteractionStatus) =>
            interactionStatus == InteractionStatus.None
        ),
        takeUntil(this._destroy)
      )
      .subscribe((x) => {
        this.isUserLoggedIn =
          this.authService.instance.getAllAccounts().length > 0;
        this.user = this.authService.instance.getAllAccounts()[0].username;
        console.log("user " + this.user);
        this.azureAuthService.isUserLoggedIn.next(this.isUserLoggedIn);
      });
  }
  ngOnDestroy(): void {
    this._destroy.next(undefined);
    this._destroy.complete();
  }
}
