import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElementRef } from '@angular/core';
import * as moment from 'moment';

export class BaseFilterComponent {
    public bsConfig;
    public defaultService;
    public selector;
    public isVisilbe = false;

    constructor(
        protected appStateService: UnisysAngularAppStateServiceService,
        protected formBuilder: FormBuilder,
        protected elem: ElementRef,
    ) {
        this.selector = elem.nativeElement.tagName.toLowerCase();
        this.bsConfig = {
            containerClass: 'theme-dark-blue',
            rangeInputFormat: 'DD.MM.YYYY',
            placement: 'top',
        };
    }

    public defaultForm = new FormGroup({});

    protected builForm() {
        const rawData = this.appStateService.getViewState(this.selector);
        if (rawData) {
            const recoveredFormValues = {};
            Object.keys(rawData).forEach(key => {
                if (rawData[key] !== null && (rawData[key].hasOwnProperty('data') && rawData[key].hasOwnProperty('operator'))) {
                    const subForm = {};
                    subForm['data'] = this.formBuilder.control(rawData[key].data ? rawData[key].data : '');
                    subForm['operator'] = this.formBuilder.control(rawData[key].operator ? rawData[key].operator : '');
                    recoveredFormValues[key] = new FormGroup(subForm);
                } else if (rawData[key] !== null && (rawData[key].hasOwnProperty('values') && rawData[key].hasOwnProperty('operator'))) {
                    const subForm = {};
                    if (moment(rawData[key].values[0], moment.ISO_8601, true).isValid()) {
                        const datesToReturn = [];
                        rawData[key].values.forEach(function (value) {
                            datesToReturn.push(new Date(value));
                        });
                        subForm['values'] = this.formBuilder.control(datesToReturn);
                    } else {
                        subForm['values'] = this.formBuilder.control(rawData[key].values ? rawData[key].values : '');
                    }
                    subForm['operator'] = this.formBuilder.control(rawData[key].operator ? rawData[key].operator : '');
                    recoveredFormValues[key] = new FormGroup(subForm);
                } else if (rawData[key] !== null && rawData[key][0] && rawData[key] === Array && Date.parse(rawData[key][0])) {
                    const arrayToReturn = [];
                    rawData[key].forEach(function (value) {
                        arrayToReturn.push(new Date(value));
                    });
                    recoveredFormValues[key] = this.formBuilder.control(arrayToReturn);
                } else if (moment(rawData[key], moment.ISO_8601, true).isValid()) {
                    recoveredFormValues[key] = this.formBuilder.control(new Date(rawData[key]));
                } else {
                    recoveredFormValues[key] = this.formBuilder.control(rawData[key]);
                }
            });
            this.defaultForm = this.formBuilder.group(recoveredFormValues);
        }
    }

    public onSubmit() {
        this.defaultService.setFilterByForm(this.defaultForm.value).setPage(1).getItemList();
        this.appStateService.setViewState(this.defaultForm.value, this.selector);
    }

    public clearAndSearch() {
        this.defaultForm.reset();
        this.defaultService.isFilterSetted = false;
        this.defaultService.isIntervalSetted = false;
        this.appStateService.setViewState(null, this.selector);
        this.defaultService.setFilter().setPage(1).getItemList();
    }

    public loadFilter(service) {
        if (service !== undefined) {
            service.setSearch().setFilter().setOrder('name').getItemList();
        }
    }

    toggleFilter(value?: boolean) {
        if (value) {
            this.isVisilbe = value;
        } else {
            this.isVisilbe = !this.isVisilbe;
        }
    }
}
