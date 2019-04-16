import { Inject, Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class VersionCheckService {

    /**
     * Current (server) version of application
     */
    public currentVersion: number;

    /**
     * Local version of application (local storage version)
     */
    public localVersion: number;

    /**
     * New version is available to load
     */
    public newVersion: boolean = false;

    constructor(
        public userService: UserService,
        @Inject('env') public environment
    ) {

        if (typeof this.environment['VERSION'] !== 'undefined') {
            this.currentVersion = this.environment['VERSION'];
        }
    }

    /**
     * Initialization - check version of application
     */
    checkVersion() {

        if (typeof this.getCurrentVersion() === 'undefined') {
            return false;
        }

        this.checkLocalVersion();

        let localVersion = this.getLocalVersion();
        let serverVersion = this.getCurrentVersion();

        if (localVersion !== serverVersion) {
            this.setNewVersion(true);
        }
    }

    /**
     * Get local version of application, and set to current version if it's not defined
     */
    checkLocalVersion() {

        let localVersion = localStorage.getItem('app-version');

        if (localVersion === null) {
            localStorage.setItem('app-version', this.getCurrentVersion().toString());
        }

        this.setLocalVersion(parseFloat(localStorage.getItem('app-version')));

    }

    /**
     * Set current application version to local storage
     */
    setVersionToLocalStorage() {
        localStorage.setItem('app-version', this.getCurrentVersion().toString());
    }

    /**
     * Force to reload application
     */
    reloadApplication() {

        console.log('Loading new application version');
        localStorage.clear();
        this.setVersionToLocalStorage();
        this.userService.logOut();
        window.location.reload(true);

    }

    // Getters & Setters

    /**
     * Set app local version
     *
     * @param version Version of app
     */
    setLocalVersion(version: number) {
        this.localVersion = version;
    }

    /**
     * Set app current version
     *
     * @param version Version of app
     */
    setCurrentVersion(version: number) {
        this.currentVersion = version;
    }

    /**
     * Set if application have new version available
     *
     * @param state True if new application is available, false if not
     */
    setNewVersion(state: boolean) {
        this.newVersion = state;
    }

    /**
     * Get local version of app
     */
    getLocalVersion() {
        return this.localVersion;
    }

    /**
     * Get current version of app
     */
    getCurrentVersion() {
        return this.currentVersion;
    }

    /**
     * Check if new application is available
     */
    getNewVersion() {
        return this.newVersion;
    }
}
