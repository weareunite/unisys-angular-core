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

#### Helpers libraries

Library | Description
--- | ---
`<unisys-core-dumperson [object]:{}></unisys-core-dumperson>` | JSON object parsed into list-tree

#### Integration
* Before installing this Core Module, install Angular project first (command **ng new**)
* Point to file **app.module.ts** in src/app folder
* Replace **GlobalComponent** to **UnisysAngularCoreComponent** in bootstrap
* Add **UnisysAngularCoreModule** to imports

Your app.module.ts file should looks like this

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


// Imported UniSys Core Module and Component
import { UnisysAngularCoreModule } from '@weareunite/unisys-angular-core';
import { UnisysAngularCoreComponent } from '@weareunite/unisys-angular-core';
import { GlobalComponent } from './app.component';

// Import default environment from app and provided it for root
import {environment} from '../environments/environment';

@NgModule({
  declarations: [
    GlobalComponent
  ],
  imports: [
    BrowserModule,
    UnisysAngularCoreModule.forRoot(environment)
  ],
  providers: [],
  bootstrap: [
    UnisysAngularCoreComponent,
    GlobalComponent
    ]
})
export class AppModule { }

```

* **Clean (not delete !)** content of your application **app.component.html** file
* Rename selector in your global.component.ts from **'app-root'** to **'app-fake-root'**
* Add **<app-fake-root></app-fake-root> into your index.html** file above <app-root></app-root>
* Then, your **index.html** file should look like this

```html
<!DOCTYPE html>
<html lang="sk-SK">

<head>
  <base href="/">
  <title>UniSys</title>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>

<body class="hold-transition fixed skin-purple sidebar-mini sidebar-collapse">
<app-root></app-root>
<app-fake-root></app-fake-root>
</body>

</html>

```

* If you want to run some code immediately when application is loaded, **implement OnInit into GlobalComponent** and use function in onInit function in GlobalComponent
* It's necessary to import module **UnisysAngularSharedModule** into your Core or Shared module to make shared components from UniSys Angular Core working
* Add snippet below as scripts into your **angular.json** file

```json
{
  "glob": "**/*",
  "input": "./node_modules/@weareunite/unisys-angular-core/assets",
  "output": "./assets/"
}
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
