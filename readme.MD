![](https://img.shields.io/badge/platform-unisys-orange.svg?style=for-the-badge)

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
* Replace **AppModule** to **UnisysAngularCoreModule** in imports
* Replace **AppComponent** to **UnisysAngularCoreComponent** in bootstrap

Your app.module.ts file should looks like this

```typescript
import {NgModule} from '@angular/core';
import {UnisysAngularCoreModule} from '../../projects/unisys-angular-core/src/lib/unisys-angular-core.module';
import {UnisysAngularCoreComponent} from '../../projects/unisys-angular-core/src/lib/unisys-angular-core.component';


@NgModule({
  declarations: [],
  imports: [UnisysAngularCoreModule],
  providers: [],
  bootstrap: [UnisysAngularCoreComponent]
})
export class AppModule {
}
```

Now you can run your application by command **ng serve**
