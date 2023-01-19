import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphComponent } from './component/graph/graph.component';
import './chart';
import { FuncComponent } from './component/func/func.component';
import { ShareComponent } from './component/share/share.component';

@NgModule({
  declarations: [AppComponent, GraphComponent, FuncComponent, ShareComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
