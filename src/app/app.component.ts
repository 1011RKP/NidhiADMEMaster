import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { Compound, ADMEData } from './data';

import { sp, Web } from 'sp-pnp-js';

import { AppService } from './app.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  selectedData: Compound;
  seletedItem: ADMEData;
  admeDATA: ADMEData[];

  Program: string;
  Compound: string;

  error: string;
  isAdminTrue: boolean = false;
  constructor(
    public toastr: ToastrService,
    vcr: ViewContainerRef,
    private _appService: AppService) { }

  ngOnInit() {
    this.getCY450DataAdmin();;
  }

  OnChange(response): void {
    this.getADMEData(this.Program, this.Compound);
    if ((response.resposeType == 'success') || (response.resposeType == 'update')) {
      this.toastr.success(response.resposeMessage);
    } else if (response.resposeType == 'error') {
      this.toastr.error(response.resposeMessage);
    }

  }

  OnDeleteChange(response): void {
    this.getADMEData(this.Program, this.Compound);
    if ((response.resposeType == 'success') || (response.resposeType == 'update')) {
      this.toastr.success(response.resposeMessage);
    } else if (response.resposeType == 'error') {
      this.toastr.error(response.resposeMessage);
    }
  }

  OnSelectionChange(selectedData: Compound): void {
    this.selectedData = selectedData;
    if (selectedData != null && selectedData !== <any>'-- Select Compound --') {
      this.Compound = this.selectedData.Id;
      this.Program = this.selectedData.Program.Id;
      this.getADMEData(this.Program, this.Compound);
    } else {
      this.Compound = null;
      this.Program = null;
    }
  }

  setseletedItem(data: ADMEData): void {
    this.seletedItem = data;
  }

  getADMEData(program: string, compound: string): void {
    const select = '?$select=Id,StudyNumber,Dose,ImaxCmax,Igut,MW,LinMax,PlasmaPB,FaFg,Ka,Qh,Rb,CommentLink,' +
      'MicrosomalPB,StableDose,Microsomaltested,Created,Program/Id,Compound/Id,Comment';//Comment
    const expand = '&$expand=Program/Id,Compound/Id';
    const filter = '&$filter=(Program/Id eq ' + program + ') and (Compound/Id eq ' + compound + ')';
    const order = '&$orderby=Created desc';
    const url = '/_api/web/lists/getbytitle(\'GeneralADMEData\')/items' + select + expand + filter + order;
    // console.log(url);
    this._appService.getListItem(url)
      .subscribe(
        (admeData) => {
          if (admeData == null) {
            // console.log('NO Data');
          } else {
            this.admeDATA = admeData.d.results;
            // console.log(this.admeDATA);
          }
        },
        (error) => {
          this.error = 'Problem accessing the Service';
          // console.log(this.error);
        });
  }

  getCY450DataAdmin(): void {
    const url = "/_api/web/currentUser/groups?$select=title,Id&$filter=title+eq+'ADME Data'";
    this._appService.getListItem(url)
      .subscribe(
        (res) => {
          console.log(res);
          if (res) {
            let userLength = res.d.results.length;
            this.isAdminTrue = (userLength !== 0) ? true : false;
          }
        },
        (error) => {
          this.error = 'Problem accessing the Service';
        });
  }
}
