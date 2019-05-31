import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {browser} from 'protractor';
import {DomSanitizer} from '@angular/platform-browser';

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

  constructor(
    public bsModalRef: BsModalRef,
    private sanitize: DomSanitizer
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

    if (typeof this.application.network !== 'undefined') {
      let bounding = this.calculateBoundingBox(this.application.network.geolocation.latitude, this.application.network.geolocation.longitude, 0.5);

      this.mapEmbedUrl = this.sanitize.bypassSecurityTrustResourceUrl('https://www.openstreetmap.org/export/embed.html?bbox=' + bounding[1] + '%2C' + bounding[0] + '%2C' + bounding[3] + '%2C' + bounding[2] + '&layer=mapnik&marker=' + this.application.network.geolocation.latitude + '%2C' + this.application.network.geolocation.longitude);
    }
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


}
