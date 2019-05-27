[![](https://img.shields.io/badge/platform-unisys-orange.svg?style=for-the-badge)](https://unite.sk)

![](https://img.shields.io/npm/v/@weareunite/unisys-angular-core.svg?style=flat-square&colorB=red)
![](https://img.shields.io/npm/l/@weareunite/unisys-angular-core.svg?style=flat-square&colorB=red)
![](https://img.shields.io/npm/dt/@weareunite/unisys-angular-core.svg?style=flat-square&colorB=red)

![](https://img.shields.io/github/tag/weareunite/unisys-angular-core.svg?style=flat-square&colorB=blue&label=github)
![](https://img.shields.io/github/last-commit/weareunite/unisys-angular-core.svg?style=flat-square&colorB=blue)
![](https://img.shields.io/github/languages/code-size/weareunite/unisys-angular-core.svg?style=flat-square&colorB=blue)
![](https://img.shields.io/github/repo-size/weareunite/unisys-angular-core.svg?style=flat-square&colorB=blue)
![](https://img.shields.io/github/languages/count/weareunite/unisys-angular-core.svg?style=flat-square&colorB=blue)
# UniSys Angular Core
Install library by running command
> npm i @weareunite/unisys-angular-core

#### Integration
* Before installing this Core Module, install Angular project first (command **ng new**)
* Point to file **app.module.ts** in src/app folder
* Replace **AppComponent** to **UnisysAngularCoreComponent** in bootstrap
* Add **UnisysAngularCoreModule** to imports

Your app.module.ts file should looks like this

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


// Imported UniSys Core Module and Component
import { UnisysAngularCoreModule } from '@weareunite/unisys-angular-core';
import { UnisysAngularCoreComponent } from '@weareunite/unisys-angular-core';

// Import default environment from app and provided it for root
import {environment} from '../environments/environment';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    UnisysAngularCoreModule.forRoot(environment)
  ],
  providers: [],
  bootstrap: [UnisysAngularCoreComponent]
})
export class AppModule { }

```
* As UnisysAngularCoreComponent is bootstrap, it's necessary to **create InitService in your application**. Directory must be **src/app/init.service.ts** and **naming must be InitService**.
* In new created init service, create function boot(). This function is called when app is loaded and all non-core functions should be called  here. Your init service should be then looked like this

```typescript
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(
    
  ) {
  }

  /**
   * Boot function. Loaded when application is loaded
   */
  public boot() {
      console.log('Application loaded !');
  }
}

```

* It's necessary to import module **UnisysAngularSharedModule** into your Core or Shared module to make shared components from UniSys Angular Core working
* Add snippet below as scripts into your **angular.json** file

```json
{
  "glob": "**/*",
  "input": "./node_modules/@weareunite/unisys-angular-core/assets",
  "output": "./assets/"
}
```              
* In **angular.json** file change variable "index" under architect.options.index

```json
"index": "./node_modules/@weareunite/unisys-angular-core/index.html",
```

* In your **enviroment** file, set this variables

Variable | Description
--- | --- 
`BASE_API_URL` | URL to base API
`GRAPHQL_API_URL` | URL to base GraphQL API
`OAUTH_TOKEN_URL` | URL to obtain auth token
`OAUTH_FAST_TOKEN_URL` | URL to obtain fast auth token
`OAUTH_CLIENT_SECRET` | Client secret
`OAUTH_CLIENT_ID` | Client ID

* Copy all entries from **language files located in module/assets/i18n** to associated language files in **your application app/assets/i18n folder**. This will ensure, that all language files from module will be available in your application.

Now you can run your application by command **ng serve**
