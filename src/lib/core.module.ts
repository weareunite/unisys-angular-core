import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideComponent } from './aside/aside.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { UnisysAngularSharedModule } from './shared/unisys-angular-shared.module';
import { AppRoutingModule } from './app-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UserProfileComponent } from './header/user-profile/user-profile.component';
import { AppSettingsComponent } from './header/app-settings/app-settings.component';
import { BsDatepickerModule, ModalModule, TabsModule, TimepickerModule, TooltipModule } from 'ngx-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { ApolloModule } from 'apollo-angular';
import { HelpComponent } from './help/help.component';
import { LogEverywhereComponent } from './log-everywhere/log-everywhere.component';

@NgModule({
    imports: [
        CommonModule,
        UnisysAngularSharedModule,
        AppRoutingModule,
        NgxPermissionsModule.forRoot(),
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        ApolloModule,
        HttpLinkModule,
    ],
    declarations: [
        AsideComponent,
        FooterComponent,
        HeaderComponent,
        UserProfileComponent,
        AppSettingsComponent,
        HelpComponent,
        LogEverywhereComponent,
    ],
    exports: [
        AsideComponent,
        FooterComponent,
        HeaderComponent,
        HelpComponent,
        AppRoutingModule,
        ApolloModule,
        HttpLinkModule,
        LogEverywhereComponent,
    ]
})
export class CoreModule {
}
