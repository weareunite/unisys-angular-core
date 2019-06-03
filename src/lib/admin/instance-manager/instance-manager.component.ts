import {Component, OnInit} from '@angular/core';
import {InstanceService} from '../../services/instance.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'lib-instance-manager',
  templateUrl: './instance-manager.component.html',
  styleUrls: ['./instance-manager.component.scss']
})
export class InstanceManagerComponent implements OnInit {

  public isOpened: boolean = false;
  public loading: boolean = true;
  public availableInstances: any[];
  public currentInstance;

  public instanceChanged: Subscription;

  constructor(
    public instanceService: InstanceService
  ) {
  }

  ngOnInit() {

    this.instanceChanged = this.instanceService.instanceChanged.subscribe(() => {
      this.setLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    });

    this.availableInstances = [
      {
        id: 1,
        name: 'Tabacka'
      },
      {
        id: 2,
        name: 'Jahodnik'
      },
      {
        id: 3,
        name: 'Stanica'
      },
      {
        id: 4,
        name: 'Unite Grant'
      }
    ];

    this.currentInstance = {
      id: 4,
      name: 'Unite Grant'
    };

    // @todo Delete this - only for check
    setTimeout(() => {
      this.loading = false;
    }, 4000);
  }

  /**
   * Toggle submenu opening
   */
  toggleOpen() {

    // If only one instance available, return
    if (this.countAvailableInstances() <= 1) {
      return false;
    }

    // If component is still loading, return
    if (this.getLoading()) {
      return false;
    }

    if (this.getIsOpened()) {
      this.setIsOpened(false);
    } else {
      this.setIsOpened(true);
    }
  }

  /**
   * Change working instance trigger
   *
   * @param instance Instance
   */
  changeInstance(instance) {
    // @todo change instance via service
    this.toggleOpen();
    this.setLoading(true);
    this.setCurrentInstance(instance);
    this.instanceService.changeInstance(instance.id);
  }

  /**
   * Count available instances
   */
  countAvailableInstances() {
    return this.availableInstances.length;
  }

  /**
   * Check if submenu is opened
   */
  getIsOpened() {
    return this.isOpened;
  }

  /**
   * Get current instance
   */
  getCurrentInstance() {
    return this.currentInstance;
  }

  /**
   * Get loading state
   */
  getLoading() {
    return this.loading;
  }

  /**
   * Set current instance
   *
   * @param instance Instance
   */
  setCurrentInstance(instance) {
    this.currentInstance = instance;
  }

  /**
   * Set state for submenu opening
   *
   * @param state State
   */
  setIsOpened(state: boolean) {
    this.isOpened = state;
  }

  /**
   * Set state for loading
   *
   * @param state State
   */
  setLoading(state: boolean) {
    this.loading = state;
  }

}
