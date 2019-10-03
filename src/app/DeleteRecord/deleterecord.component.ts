import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ADMEData } from '../data';
import { AppService } from '../app.service';

@Component({
    selector: 'app-deleterecord',
    templateUrl: './deleterecord.component.html',
    styleUrls: ['./deleterecord.component.css']
})

export class DeleterecordComponent implements OnInit {
    @Input()
    data: ADMEData;
    deleteresponse: string;

    @Output()
    OnDeleteClickEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private _appService: AppService) { }

    ngOnInit() {
    }

    errorResponse() {
        let obj = {
            resposeType: 'error',
            resposeMessage: 'Problem creating record. Please contact IT.'
        }
        this.OnDeleteClickEvent.emit(obj);
    }

    deleteRecord(): void {
        if (this.data) {
            this._appService.getService().subscribe(
                (res) => {
                    if (res !== null) {
                        const url = '/_api/web/lists/getbytitle(\'GeneralADMEData\')/items(' + this.data.Id + ')';
                        this._appService.deleteDatafromList(url, res.d.GetContextWebInformation.FormDigestValue)
                            .subscribe(
                                (dataresponse) => {
                                    let obj = {
                                        resposeType: 'success',
                                        resposeMessage: 'Deleted Successfully'
                                    }
                                    this.OnDeleteClickEvent.emit(obj);
                                },
                                (error) => {
                                    this.errorResponse();
                                });
                    } else {
                        //this.errorResponse();
                    }
                },
                (error) => {
                    //this.errorResponse();
                });
        }

    }

}

