import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { ActivityLogService } from '../../../services/activity-log.service';
import { User } from '@weareunite/unisys-angular-core/lib/models';
import { UserService } from '../../../services/user.service';
import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';
import { BaseFilterComponent } from '../../../shared/base-filter/base-filter.component';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['../../../shared/base-filter/base-filter.component.scss']
})
export class FilterComponent extends BaseFilterComponent implements OnInit {

    public userList: User[];
    protected userSubscription: Subscription;

    public subjectTypeList: object[];
    protected subjectTypeListSubscription: Subscription;
    public bsConfig;

    constructor(
        public    defaultService: ActivityLogService,
        public    userService: UserService,
        protected appStateService: UnisysAngularAppStateServiceService,
        protected formBuilder: FormBuilder,
        protected elem: ElementRef,
    ) {
        super(appStateService, formBuilder, elem);
        this.bsConfig = {
            containerClass: 'theme-dark-blue',
            rangeInputFormat: 'DD.MM.YYYY',
            placement: 'top',
        };

        this.initialValues = {
            created_at: {
                operator: 'between',
                values: []
            }
        };
    }

    ngOnInit() {
        this.userSubscription = this.userService.listChanged
            .subscribe(
                (list) => {
                    this.userList = list;
                    this.userSubscription.unsubscribe();
                }
            );
        this.userService.getItemList();

        this.subjectTypeListSubscription = this.defaultService.distinctListChanged
            .subscribe(
                (list) => {
                    this.subjectTypeList = list;
                    this.subjectTypeListSubscription.unsubscribe();
                }
            );
        this.defaultService.getDistinctList('subject_type');
        this.builForm();
    }

    defaultForm = new FormGroup({
        'created_at': new FormGroup({
            'values': new FormControl(''),
            'operator': new FormControl('between'),
        }),
        'causer_id': new FormControl(),
        'subject_type': new FormControl(),
    });

}
