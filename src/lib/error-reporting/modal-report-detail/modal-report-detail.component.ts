import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {browser} from 'protractor';
import {DomSanitizer} from '@angular/platform-browser';
import {ErrorReportService} from '../../services/error-report.service';
import {Subscription} from 'rxjs';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'lib-modal-report-error',
  templateUrl: './modal-report-detail.component.html',
  styleUrls: ['./modal-report-detail.component.scss']
})
export class ModalReportDetailComponent implements OnInit {

  public item;
  public browser;
  public application;
  public datetime;
  public issue;
  public localStorage;
  public permissions;
  public viewState;
  public mapEmbedUrl;
  public positionEmbedUrl;
  public screenshots;
  public screenshotImage;

  public screenshotsLoaded: Subscription;

  constructor(
    public bsModalRef: BsModalRef,
    private sanitize: DomSanitizer,
    private errorReportService: ErrorReportService,
    private httpService: HttpService
  ) {
  }

  ngOnInit() {
    let parsedData = JSON.parse(this.item.content);
    this.browser = parsedData.browser;
    this.application = parsedData.application;
    this.datetime = parsedData.datetime;
    this.issue = parsedData.issue;
    this.localStorage = parsedData.localStorage;
    this.permissions = JSON.parse(this.localStorage.permissions);
    this.viewState = JSON.parse(this.localStorage.viewState);

    this.errorReportService.getFiles(this.item.id);

    if (typeof this.application.location !== 'undefined' && Object.keys(this.application.location).length > 0) {
      let currentBounding = this.calculateBoundingBox(this.application.location.latitude, this.application.location.longitude, 0.5);

      this.positionEmbedUrl = this.sanitize.bypassSecurityTrustResourceUrl('https://www.openstreetmap.org/export/embed.html?bbox=' + currentBounding[1] + '%2C' + currentBounding[0] + '%2C' + currentBounding[3] + '%2C' + currentBounding[2] + '&layer=mapnik&marker=' + this.application.location.latitude + '%2C' + this.application.location.longitude);
    }

    if (typeof this.application.network !== 'undefined') {
      if (typeof this.application.network.geolocation !== 'undefined') {
        let bounding = this.calculateBoundingBox(this.application.network.geolocation.latitude, this.application.network.geolocation.longitude, 0.5);

        this.mapEmbedUrl = this.sanitize.bypassSecurityTrustResourceUrl('https://www.openstreetmap.org/export/embed.html?bbox=' + bounding[1] + '%2C' + bounding[0] + '%2C' + bounding[3] + '%2C' + bounding[2] + '&layer=mapnik&marker=' + this.application.network.geolocation.latitude + '%2C' + this.application.network.geolocation.longitude);
      }
    }

    this.screenshotsLoaded = this.errorReportService.screenshotLoaded.subscribe((result) => {

      if (Object.keys(result).length > 0) {

        let streamLink = 'media/' + result[0]['id'] + '/stream';
        this.setScreenshots(result);

        this.httpService.streamImage(streamLink).subscribe((data) => {
          let baseFile = this.httpService.imageEncode(data);
          this.setScreenshotImage(baseFile);
        });
      }
    });

  }

  deg2rad(degrees) {
    return Math.PI * degrees / 180.0;
  }

  rad2deg(radians) {
    return 180.0 * radians / Math.PI;
  }

  WGS84EarthRadius(lat) {

    let WGS84_a = 6378137.0;
    let WGS84_b = 6356752.3;

    let An = WGS84_a * WGS84_a * Math.cos(lat);
    let Bn = WGS84_b * WGS84_b * Math.sin(lat);
    let Ad = WGS84_a * Math.cos(lat);
    let Bd = WGS84_b * Math.sin(lat);
    return Math.sqrt((An * An + Bn * Bn) / (Ad * Ad + Bd * Bd));
  }

  calculateBoundingBox(latitudeInDegrees, longitudeInDegrees, halfSideInKm) {
    let lat = this.deg2rad(latitudeInDegrees);
    let lon = this.deg2rad(longitudeInDegrees);
    let halfSide = 1000 * halfSideInKm;

    let radius = this.WGS84EarthRadius(lat);
    let pradius = radius * Math.cos(lat);

    let latMin = lat - halfSide / radius;
    let latMax = lat + halfSide / radius;
    let lonMin = lon - halfSide / pradius;
    let lonMax = lon + halfSide / pradius;

    return [this.rad2deg(latMin), this.rad2deg(lonMin), this.rad2deg(latMax), this.rad2deg(lonMax)];
  }

  downloadScreenshot(item) {
    this.errorReportService.download(item.downloadLink, item.mime_type, item.name);
  }

  setScreenshotImage(image) {
    this.screenshotImage = image;
  }

  setScreenshots(screenshots) {
    this.screenshots = screenshots;
  }


}
