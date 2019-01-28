import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {RouterModule} from '@angular/router';
import {DropdownDirective} from './dropdown.directive';
import {FilterColumnsPipe} from './filter-columns.pipe';
import {FilterVisibilityPipe} from './filter-visibility.pipe';
import {SlideAssetDirective} from './slide-asset.directive';
import {SortByPipe} from './sort-by.pipe';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// UniSys Modules
import {UnisysAngularTabRouterModule} from '@weareunite/unisys-angular-tab-router';
import {UnisysAngularFormGroupModule} from '@weareunite/unisys-angular-form-group';
import {UnisysAngularInputWrapperModule} from '@weareunite/unisys-angular-input-wrapper';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UnisysAngularTabRouterModule,
    UnisysAngularFormGroupModule,
    UnisysAngularInputWrapperModule,
    HttpClientModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    DropdownDirective,
    FilterColumnsPipe,
    FilterVisibilityPipe,
    SlideAssetDirective,
    SortByPipe
  ],
  exports: [
    CommonModule,
    UnisysAngularTabRouterModule,
    UnisysAngularFormGroupModule,
    UnisysAngularInputWrapperModule,
    TranslateModule,
    DropdownDirective,
    FilterColumnsPipe,
    FilterVisibilityPipe,
    SlideAssetDirective,
    SortByPipe,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [],
})
export class SharedModule {
  constructor(
    translate: TranslateService,
  ) {
// userLang = translate.getBrowserLang(); for future translations
    translate.setDefaultLang('sk');
    translate.use('sk');
  }
}
