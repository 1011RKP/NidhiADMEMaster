import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Program, Compound } from '../data';
import { AppService } from '../app.service';
import { OrderByPipe } from '../customPipe';

@Component({
    selector: 'app-selectcompound',
    templateUrl: './selectcompound.component.html',
    styleUrls: ['./selectcompound.component.css']
})

export class SelectcompoundComponent implements OnInit {
    allProgram: Program[];
    allCompound: Compound[];
    selectedProgram: string;
    selectedCompound: Compound;
    cacadedCompound: Compound[];
    error: string;
    pleaseSelectCompound: any = '-- Select Compound --';

    @Output()
    OnprogramselectionChangedEvent: EventEmitter<Compound> = new EventEmitter<Compound>();

    constructor(
        private _appService: AppService) { }

    ngOnInit() {
        this.getProgram();
    }

    onprogramselectionChanged() {
        this.OnprogramselectionChangedEvent.emit(this.selectedCompound);
    }

    getProgram(): void {
        const select = '?$select=Id,Title';
        const url = '/_api/web/lists/getbytitle(\'ProgramList\')/items' + select;
        this._appService.getListItem(url)
            .subscribe(
            (programData) => {
                if (programData == null) {
                    console.log('NO Data');
                } else {
                    this.allProgram = programData.d.results;
                    if (this.allProgram.length !== 0) {
                        this.selectedProgram = '-- Select Program --' ;
                        this.getCompound();
                    } else {
                        this.selectedProgram = null;
                    }
                }
            },
            (error) => {
                this.error = 'Problem accessing the Service';
                console.log(this.error);
            });
    }

    getCompound(): void {
        this.selectedCompound = this.pleaseSelectCompound;
        const select = '?$select=Id,Title,Program/Title,Program/Id&$expand=Program';
        const url = '/_api/web/lists/getbytitle(\'CompoundList\')/items' + select;
        this._appService.getListItem(url)
            .subscribe(
            (compoundData) => {
                if (compoundData == null) {
                    console.log('NO Data');
                } else {
                    this.allCompound = compoundData.d.results;
                }
            },
            (error) => {
                this.error = 'Problem accessing the Service';
                console.log(this.error);
            });
    }

    onSelect(program: string) {
        this.selectedCompound = this.pleaseSelectCompound;
        if (this.allCompound.length !== 0) {
            this.cacadedCompound = this.allCompound.filter(
                // tslint:disable-next-line:triple-equals
                (item) => item.Program.Title == program);
            if (this.cacadedCompound.length !== 0) {
                this.OnprogramselectionChangedEvent.emit(null);
            } else {
             this.OnprogramselectionChangedEvent.emit(null);
            }
        }
    }
}
