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
import {TableComponent} from './table/table.component';
import {ModalDeleteComponent} from './table/modal-delete/modal-delete.component';
import {ModalTagComponent} from './table/modal-tag/modal-tag.component';
import {ModalTagDeleteComponent} from './table/modal-tag-delete/modal-tag-delete.component';
import {NgxPermissionsModule} from 'ngx-permissions';
import {BsDatepickerModule, BsLocaleService, TimepickerModule, TooltipModule} from 'ngx-bootstrap';
import {TruncateModule} from 'ng2-truncate';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {skLocale} from 'ngx-bootstrap/locale';
import {AngularEditorModule} from '@kolkov/angular-editor';

// UniSys Modules
import {UnisysAngularTabRouterModule} from '@weareunite/unisys-angular-tab-router';
import {UnisysAngularFormGroupModule} from '@weareunite/unisys-angular-form-group';
import {UnisysAngularInputWrapperModule} from '@weareunite/unisys-angular-input-wrapper';
import {UnisysAngularViewButtonModule} from '@weareunite/unisys-angular-view-button';
import {UnisysAngularProgressBarModule} from '@weareunite/unisys-angular-progress-bar';
import {LogViewComponent} from './log-view/log-view.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    AngularEditorModule,
    BsDatepickerModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
    NgxPermissionsModule,
    ReactiveFormsModule,
    RouterModule,
    TimepickerModule,
    TooltipModule,
    TruncateModule,
    UnisysAngularFormGroupModule,
    UnisysAngularInputWrapperModule,
    UnisysAngularProgressBarModule,
    UnisysAngularTabRouterModule,
    UnisysAngularViewButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    DropdownDirective,
    FilterColumnsPipe,
    FilterVisibilityPipe,
    ModalDeleteComponent,
    ModalTagComponent,
    ModalTagDeleteComponent,
    SlideAssetDirective,
    SortByPipe,
    TableComponent,
    LogViewComponent,
  ],
  exports: [
    AngularEditorModule,
    BsDatepickerModule,
    CommonModule,
    DropdownDirective,
    FilterColumnsPipe,
    FilterVisibilityPipe,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    SlideAssetDirective,
    SortByPipe,
    TableComponent,
    TimepickerModule,
    TranslateModule,
    TruncateModule,
    UnisysAngularFormGroupModule,
    UnisysAngularInputWrapperModule,
    UnisysAngularProgressBarModule,
    UnisysAngularTabRouterModule,
    UnisysAngularViewButtonModule,
    LogViewComponent,
  ],
  entryComponents: [
    ModalDeleteComponent,
    ModalTagComponent,
    ModalTagDeleteComponent
  ]
})
export class UnisysAngularSharedModule {
  constructor(
    translate: TranslateService,
    private localeService: BsLocaleService
  ) {
    defineLocale('sk', skLocale);
    this.localeService.use('sk');
// userLang = translate.getBrowserLang(); for future translations
    translate.setDefaultLang('sk');
    translate.use('sk');
  }
}
