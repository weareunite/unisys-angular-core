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
* Point to file **main.ts** in src folder
* Replace **AppModule** to **UnisysAngularCoreModule** in imports

Your app.module.ts file should looks like this

```typescript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';
import { UnisysAngularCoreModule } from '@weareunite/unisys-angular-core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(UnisysAngularCoreModule)
  .catch(err => console.error(err));
```

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
`OAUTH_TOKEN_URL` | URL to obtain auth token
`OAUTH_FAST_TOKEN_URL` | URL to obtain fast auth token
`OAUTH_CLIENT_SECRET` | Client secret
`OAUTH_CLIENT_ID` | Client ID

Now you can run your application by command **ng serve**
