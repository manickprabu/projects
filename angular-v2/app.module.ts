import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NavigationModule } from './shared/navigation/navigation.module';
import { AppConfig } from './core/config/app.config';
import { SharedModule } from './shared/shared.module';
import { DocumentsModule } from './documents/documents.module';
import { ListModule } from './shared/list/list.module';
import { SearchModule } from './search/search.module';
import { CaseModule } from './case/case.module';

import { AppComponent } from './app.component';
import { RoutingComponent } from './core/routing/routing.component';
import { HomeComponent } from './home/home.component';

import { HttpClientService } from './shared/http-client.service';

export function loadConfig(config: AppConfig) {
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingComponent,
    CommonModule,
    SharedModule,
    DocumentsModule,
    SearchModule,
    ListModule,
    NavigationModule,
    CaseModule
  ],
  providers: [
    AppConfig,
    HttpClientService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [AppConfig],
      multi: true
    },
    { provide: 'IS_DEV', useValue: true }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
