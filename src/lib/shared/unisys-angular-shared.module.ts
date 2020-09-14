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
import { BsDatepickerModule, BsLocaleService, enGbLocale, TimepickerModule, TooltipModule, defineLocale, skLocale } from 'ngx-bootstrap';
import {TruncateModule} from 'ng2-truncate';
import {AngularEditorModule} from '@kolkov/angular-editor';

// UniSys Modules
import {UnisysAngularTabRouterModule} from '@weareunite/unisys-angular-tab-router';
import {UnisysAngularInputWrapperModule} from '@weareunite/unisys-angular-input-wrapper';
import {UnisysAngularViewButtonModule} from '@weareunite/unisys-angular-view-button';
import {UnisysAngularProgressBarModule} from '@weareunite/unisys-angular-progress-bar';
import {LogViewComponent} from './log-view/log-view.component';
import {LoaderComponent} from './loader/loader.component';
import {DumpObjectPipe} from '../pipes/dump-object.pipe';
import {DumpersonComponent} from './dumperson/dumperson.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {MomentPipe} from '../pipes/moment.pipe';
import {CharAtPipe} from '../pipes/char-at.pipe';
import {SubstringPipe} from '../pipes/substring.pipe';
import {IsNaNPipe} from '../pipes/isNaN.pipe';
import { SanitizeHtmlPipe } from '../pipes/sanitizeHtml.pipe';
import { UnisysAngularFormGroupModule } from '@weareunite/unisys-angular-form-group';
import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';
import { CoreService } from '../services/core.service';

// Local UniSys GIT modules in project (for development purposes only !)
// import {UnisysAngularFormGroupModule} from '../../../../unisys-angular-form-group/src/lib/unisys-angular-form-group.module';

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
    LoaderComponent,
    SpinnerComponent,
    DumpObjectPipe,
    MomentPipe,
    DumpersonComponent,
    CharAtPipe,
    SubstringPipe,
    IsNaNPipe,
    SanitizeHtmlPipe,
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
    LoaderComponent,
    SpinnerComponent,
    DumpObjectPipe,
    MomentPipe,
    DumpersonComponent,
    CharAtPipe,
    SubstringPipe,
    IsNaNPipe,
    SanitizeHtmlPipe,
  ],
  entryComponents: [
    ModalDeleteComponent,
    ModalTagComponent,
    ModalTagDeleteComponent
  ]
})
export class UnisysAngularSharedModule {
  constructor(
    private appStateService: UnisysAngularAppStateServiceService,
    private coreService: CoreService,
    private translate: TranslateService,
    private localeService: BsLocaleService

  ) {
    const langCode = this.appStateService.getAppState('language');
    const userLang = translate.getBrowserLang();
    let selectedLang = '';
    let localeString = '';
    if (langCode) {
      selectedLang = langCode;
    } else if (userLang) {
      selectedLang = userLang;
    }
    switch (selectedLang) {
      case 'sk':
        localeString = 'sk';
        defineLocale(localeString, skLocale);
        break;
      case 'en':
        localeString = 'engb';
        defineLocale(localeString, enGbLocale);
        break;
      default:
        localeString = 'sk';
        defineLocale(localeString, skLocale);
        break;
    }
    this.localeService.use(localeString);
    this.translate.setDefaultLang(localeString);
    this.translate.use(localeString);
  }
}
