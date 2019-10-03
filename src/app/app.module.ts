import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SelectcompoundComponent } from './SelectCompound/selectcompound.component';
import { DeleterecordComponent } from './Deleterecord/deleterecord.component';
import { AddeditrecordComponent } from './AddEditrecord/addeditrecord.component';

import { AppService } from './app.service';
import { OrderByPipe } from './customPipe';
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [
    AppComponent,
    SelectcompoundComponent,
    DeleterecordComponent,
    AddeditrecordComponent,
    OrderByPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [AppService, OrderByPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
