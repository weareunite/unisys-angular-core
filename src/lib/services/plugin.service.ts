import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/**
 * Handling simple turning ON/OFF of functionality conditioned parts of code as plugins
 */
export class PluginService {

  /**
   * List of available plugins
   */
  public availablePlugins: any[] = [
    'error_reporting',
    // 'version_control',
    // 'instance_manager'
  ];

  constructor() {
  }

  /**
   * Check if plugin is available
   *
   * @param pluginName Plugin name
   */
  isAvailable(pluginName: string) {

    return this.availablePlugins.includes(pluginName);
  }

}
