import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Compound, ADMEData, Comment } from '../data';
import { AppService } from '../app.service';
import { parse } from 'url';
//import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    selector: 'app-addeditrecord',
    templateUrl: './addeditrecord.component.html',
    styleUrls: ['./addeditrecord.component.css']
})

export class AddeditrecordComponent implements OnInit, OnChanges {
    newRecord: ADMEData;
    admeDATA: ADMEData[];

    error: string;
    message: string;

    StudyNumber: string;
    Dose: string;
    ImaxCmax: string;
    Igut: string;
    MW: string;
    LinMax: string;
    PlasmaPB: string;
    MicrosomalPB: string;
    StableDose: boolean;
    FaFg: string;
    Ka: string;
    Qh: string;
    Rb: string;
    Microsomaltested: boolean;
    Comment: string;
    CommentDescription: string;
    CommentURL: string;
    linkError: boolean = false;

    @Input()
    Title: string;
    @Input()
    Program: string;
    @Input()
    Compound: string;
    @Input()
    data: ADMEData;

    @Output()
    OnCancelClickEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private _appService: AppService,
        //public toastr: ToastsManager,
        vcr: ViewContainerRef
    ) {
        //this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnChanges() {
        if (this.data) {
            // console.log('calling on data on change');
            if (this.Title === 'Edit Record') {
                this.StudyNumber = this.data.StudyNumber;
                this.Dose = this.data.Dose;
                this.ImaxCmax = this.data.ImaxCmax;
                this.Igut = this.data.Igut;
                this.MW = this.data.MW;
                this.LinMax = this.data.LinMax;
                this.PlasmaPB = this.data.PlasmaPB;
                this.MicrosomalPB = this.data.MicrosomalPB;
                this.StableDose = this.data.StableDose;
                this.FaFg = this.data.FaFg;
                this.Ka = this.data.Ka;
                this.Qh = this.data.Qh;
                this.Rb = this.data.Rb;
                this.Microsomaltested = this.data.Microsomaltested;
                this.Comment = this.data.Comment;
                this.CommentDescription = (this.data.CommentLink !== null) ? this.data.CommentLink.Description : "";
                this.CommentURL = (this.data.CommentLink !== null) ? this.data.CommentLink.Url : "";
            }
        } else {
            // console.log('calling on data on change Else');
        }
    }

    ngOnInit() {
        this.linkError = false;
        this.StableDose = false;
        this.cleaninputs();
    }

    submitClick(form: NgForm): void {
        // this.linkError = (this.CommentDescription !== null && this.CommentURL === null) ? true : false;
        // if (this.linkError == false) {

        // } else {
        //     console.log("issue");
        //}
        this.calculateValues();
        if (this.Title != null && this.Title !== '') {
            if (this.Title === 'Add New') {
                this.saveChanges(form);
            } else {
                this.editRecord();
            }
        }
    }

    saveChanges(form: NgForm): void {
        // console.log(this.Compound);
        // console.log(this.Program);
        if (this.Compound !== '' && this.Program !== '') {
            this._appService.getService().subscribe(
                (res) => {
                    // console.log(res.length);
                    // console.log(res);
                    if (res.length !== 0) {
                        // console.log('res' + res.d.GetContextWebInformation.FormDigestValue);
                        // console.log('Inside Click');
                        const url = '/_api/web/lists/getbytitle(\'GeneralADMEData\')/items';
                        this._appService.addDatatoList(url, {
                            ProgramId: this.Program,
                            CompoundId: this.Compound,
                            StudyNumber: this.StudyNumber,
                            Dose: this.Dose,
                            ImaxCmax: this.ImaxCmax,
                            Igut: this.Igut,
                            MW: this.MW,
                            LinMax: this.LinMax,
                            PlasmaPB: this.PlasmaPB,
                            MicrosomalPB: this.MicrosomalPB,
                            StableDose: this.StableDose,
                            FaFg: this.FaFg,
                            Ka: this.Ka,
                            Qh: this.Qh,
                            Rb: this.Rb,
                            Microsomaltested: this.Microsomaltested,
                            Comment: this.Comment,
                            CommentLink:
                            {
                                'Description': "Click Here",
                                'Url': this.CommentURL
                            },
                        }, res.d.GetContextWebInformation.FormDigestValue)
                            .subscribe(
                                (dataresponse) => {
                                    // console.log(dataresponse.length);
                                    if (dataresponse.length === 0) {
                                        this.errorResponse();
                                    } else {
                                        this.newRecord = dataresponse.d;
                                        let obj = {
                                            resposeType: 'success',
                                            resposeMessage: 'Added new ADME Data with study # : ' + this.StudyNumber
                                        }
                                        this.OnCancelClickEvent.emit(obj);
                                        if (this.StableDose === true) {
                                            this.getRecords(dataresponse.d.Id, this.Program, this.Compound);
                                        }
                                        this.cleaninputs();
                                        this.resetForm(form);
                                    }
                                },
                                (error) => {
                                    this.errorResponse();
                                });
                    } else {
                        this.errorResponse();
                    }
                },
                (error) => {
                    this.errorResponse();
                });
        }
    }

    editRecord(): void {
        if (this.Compound !== '' && this.Program !== '') {
            this._appService.getService().subscribe(
                (res) => {
                    if (res.length !== 0) {
                        // console.log('res' + res.d.GetContextWebInformation.FormDigestValue);
                        // console.log('Inside Click');
                        const url = '/_api/web/lists/getbytitle(\'GeneralADMEData\')/items(' + this.data.Id + ')';
                        this._appService.editDatatoList(url, {
                            StudyNumber: this.StudyNumber,
                            Dose: this.Dose,
                            ImaxCmax: this.ImaxCmax,
                            Igut: this.Igut,
                            MW: this.MW,
                            LinMax: this.LinMax,
                            PlasmaPB: this.PlasmaPB,
                            MicrosomalPB: this.MicrosomalPB,
                            StableDose: this.StableDose,
                            FaFg: this.FaFg,
                            Ka: this.Ka,
                            Qh: this.Qh,
                            Rb: this.Rb,
                            Microsomaltested: this.Microsomaltested,
                            Comment: this.Comment,
                            CommentLink:
                            {
                                'Description': "Click Here",
                                'Url': this.CommentURL
                            },
                        }, res.d.GetContextWebInformation.FormDigestValue)
                            .subscribe(
                                (dataresponse) => {
                                    if (this.StableDose === true) {
                                        this.getRecords(this.data.Id, this.Program, this.Compound);
                                    } else {
                                        let obj = {
                                            resposeType: 'update',
                                            resposeMessage: 'Updated ADME Data with study # : ' + this.StudyNumber
                                        }
                                        this.OnCancelClickEvent.emit(obj);
                                    }
                                    this.error = '';
                                    this.cleaninputs();
                                },
                                (error) => {
                                    this.errorResponse();
                                });
                    } else {
                        this.errorResponse();
                    }
                },
                (error) => {

                });
        }
    }


    calculateValues(): void {
        if (this.MicrosomalPB !== '' && this.MicrosomalPB !== null) {
            if (+this.MicrosomalPB < 0.01) {
                this.MicrosomalPB = '0.01';
            }
        }
        if (this.Dose !== '' && this.MW !== '' &&
            this.Dose !== null && this.MW !== null) {
            this.Igut = String(parseFloat((((+this.Dose / +this.MW) * 1000) * 4).toFixed(3)));
        } else {
            this.Igut = '';
        }
        if (this.ImaxCmax !== '' && this.FaFg !== '' && this.Ka !== '' && this.Dose !== '' && this.Qh !== '' && this.Rb !== '' &&
            this.ImaxCmax !== null && this.FaFg !== null && this.Ka !== null && this.MW !== '' &&
            this.Dose !== null && this.Qh !== null && this.Rb !== null) {// updated line 237
            //this.LinMax = String(parseFloat((+this.ImaxCmax + ((+this.FaFg * +this.Ka * +this.Dose) / +this.Qh) / +this.Rb).toFixed(3)));
            this.LinMax = String(parseFloat((+this.ImaxCmax + (((((+this.FaFg * +this.Ka * +this.Dose) / +this.Qh) / +this.Rb) / +this.MW)) * 1000000).toFixed(3)));
        } else {
            this.LinMax = '';
        }
        if (this.PlasmaPB !== '' && this.PlasmaPB !== null) {
            if (+this.PlasmaPB < 0.01) {
                this.PlasmaPB = '0.01';
            }
        }
    }

    getRecords(id: string, program: string, compound: string): void {
        const select = '?$select=Id,Created,Program/Id,Compound/Id,StableDose';
        const expand = '&$expand=Program/Id,Compound/Id';
        const filter = '&$filter=(Program/Id eq ' + program + ') and (Compound/Id eq ' + compound + ') and (StableDose eq 1)';
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
                        if (this.admeDATA.length !== 0) {
                            for (const item of this.admeDATA) {
                                // console.log(item.Id);
                                if (item.Id !== id) {
                                    this.updateotherRecords(item.Id);
                                } else {
                                    // this.OnCancelClickEvent.emit('cancel');
                                }
                            }
                            // console.log(this.admeDATA);
                        } else {
                            //this.OnCancelClickEvent.emit('cancel');
                        }
                    }
                },
                (error) => {
                    //this.toastr.error('Problem creating record. Please contact IT.');
                    //this.error = 'Problem accessing the Service';
                    console.log(this.error);
                });
    }

    updateotherRecords(Id: string) {
        this._appService.getService().subscribe(
            (res) => {
                if (res.length !== 0) {
                    const url = '/_api/web/lists/getbytitle(\'GeneralADMEData\')/items(' + Id + ')';
                    this._appService.editDatatoList(url, {
                        StableDose: false,
                    }, res.d.GetContextWebInformation.FormDigestValue)
                        .subscribe(
                            (dataresponse) => {
                                //this.OnCancelClickEvent.emit('cancel');
                            },
                            (error) => {
                            });
                } else {
                }
            },
            (error) => {
            });
    }

    cancelChange(form: NgForm): void {
        this.error = '';
        this.message = '';
        this.OnCancelClickEvent.emit('cancel');
        this.resetForm(form);
        this.cleaninputs();
    }

    resetForm(form: NgForm): void {
        form.reset();
        form.control.setValue({
            StudyNumber: '',
            Dose: '',
            ImaxCmax: '',
            MW: '',
            PlasmaPB: '',
            MicrosomalPB: '1',
            StableDose: false,
            FaFg: '1',
            Ka: '0.1',
            Qh: '1500',
            Rb: '1',
            Microsomaltested: false,
            CommentDescription: '',
            CommentURL: '',
            Comment: ''
        });
    }

    cleaninputs(): void {
        this.StudyNumber = '';
        this.Dose = '';
        this.ImaxCmax = '';
        this.Igut = '';
        this.MW = '';
        this.LinMax = '';
        this.PlasmaPB = '';
        this.MicrosomalPB = '1';
        this.StableDose = false;
        this.FaFg = '1';
        this.Ka = '0.1';
        this.Qh = '1500';
        this.Rb = '1';
        this.Microsomaltested = false;
        this.CommentDescription = '';
        this.CommentURL = '';
        this.Comment = '';
    }

    errorResponse() {
        let obj = {
            resposeType: 'error',
            resposeMessage: 'Problem creating record. Please contact IT.'
        }
        this.OnCancelClickEvent.emit(obj);
    }
}
