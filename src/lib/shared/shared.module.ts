import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UnisysAngularTabRouterModule} from '@weareunite/unisys-angular-tab-router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {RouterModule} from '@angular/router';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UnisysAngularTabRouterModule,
    HttpClientModule,
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   }
    // }),
  ],
  declarations: [],
  exports: [
    CommonModule,
    UnisysAngularTabRouterModule,
    // TranslateModule,
  ],
  entryComponents: [],
})
export class SharedModule {
  constructor() {


  }
}
