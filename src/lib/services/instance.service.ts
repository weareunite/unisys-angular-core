import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

/**
 * Class for maintenance of instances in core system
 */
export class InstanceService {

  public instanceChanged = new Subject();

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
  }

  /**
   * Change instance in application
   *
   * @param id ID of instance to be set
   */
  changeInstance(id: number) {

    // @todo Delete this - only for check
    console.log('@todo Changing instance to ' + id);
    setTimeout(() => {

      let message = '';
      let detailMessage = '';

      this.translate.get('WAIT_FOR_RELOAD').subscribe((translatedString: string) => {
        detailMessage = translatedString;
      });

      this.translate.get('INSTANCE_CHANGED').subscribe((translatedString: string) => {
        message = translatedString;
      });

      this.toastr.success(detailMessage, message);
      this.instanceChanged.next();
    }, 4000);
  }
}
