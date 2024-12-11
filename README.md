# AzureAD

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.7.

References: 
https://learn.microsoft.com/en-us/entra/identity-platform/tutorial-single-page-apps-angular-register-app

https://learn.microsoft.com/en-us/samples/azure-samples/ms-identity-ciam-javascript-tutorial/ms-identity-ciam-javascript-tutorial-2-sign-in-angular/

This application is created to demonstrate Azure-AD/Microsoft Entra ID login.
1. Create new angular project - ng new Azure-AD --no-standalone

2. Run the following command to install the necessary dependencies:
npm install @azure/msal-browser @azure/msal-angular


3. Development Environment:
Go to the public/config/config.json file and add the following details:
clientId: The client ID generated in the Azure portal.
authority: The authority URL (e.g., https://login.microsoftonline.com/{tenantId}) from the Azure portal.
redirectUri: The redirect URL created in the Azure portal (should match the one configured in Azure AD).


4. Test/Production Environments:

For the test and production environments, create a ConfigMap in Rancher that contains this JSON configuration(config.json).
- Goto configMap, Create new config map, provide name as frontend-config, key as config.json and value should contain the required json with clientId, authority, postLogoutUrl, backendUrl, and redirectUri

Goto deployment.tmpl and define a volume 
```yaml
volumes:
  - configMap:
      defaultMode: 420
      name: frontend-config
      items:
        - key: config.json
          path: config.json
      optional: false
    name: app-vol
```


then define a volume mount -

containers:
        
          volumeMounts:
            - mountPath: /usr/share/nginx/html/assets/config
              name: app-vol
          

5. Goto app.module.ts and add below code under providers to ensure json is loaded first - 
{
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfigService],
      multi: true,
},


6. Once the json is loaded, below code in app.module.ts will read the json data and initialize the azure ad properties - 
export const initConfig = (appConfig: AppConfigService) => () =>
  appConfig.loadConfig();


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
