import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

function haversineDistance(coords1, coords2, isMiles) {
  function toRad(x) {
    return x * Math.PI / 180;
  }
  const lon1 = coords1[1];
  const lat1 = coords1[0];

  const lon2 = coords2[1];
  const lat2 = coords2[0];

  const R = 6371; // km

  const x1 = lat2 - lat1;
  const dLat = toRad(x1);
  const x2 = lon2 - lon1;
  const dLon = toRad(x2);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;

  if (isMiles) { d /= 1.60934; }
  return d.toFixed(2);
}

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  @ViewChild('map') mapElem: ElementRef;
  map: google.maps.Map;
  placesService: google.maps.places.PlacesService;
  searchRadius = 1000;
  nearbyPlaces: any[];
  placeType: string;

  currentPos = {
    coords: {
      latitude: 26.462189,
      longitude: 80.295909
    }
  };

  constructor() { }

  ngOnInit() {
    this.addMap();
  }
  getLatLng() {
    return new google.maps.LatLng(this.currentPos.coords.latitude, this.currentPos.coords.longitude);
  }
  addMap() {
    const mapOptions = {
      center: new google.maps.LatLng(this.currentPos.coords.latitude, this.currentPos.coords.longitude),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElem.nativeElement, mapOptions);
    this.addMarker();
    this.placesService = new google.maps.places.PlacesService(this.map);
    this.getChaurahas();
    /*this.getNearbyPlaces();*/
  }
  addMarker() {

    const marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    const content = '<p>This is your current position !</p>';
    const infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  getNearbyPlaces() {
    if (this.nearbyPlaces) {
      this.nearbyPlaces = null;
    }
    return new Promise((resolve, reject) => {
      this.placesService.nearbySearch({
        location: this.getLatLng() ,
        radius: this.searchRadius,
        types: [this.placeType],
        /*rankBy: google.maps.places.RankBy.DISTANCE*/
      }, (results: google.maps.places.PlaceResult[], status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK)	{
          if (!this.nearbyPlaces) {
            this.markNearbyMarkers(results);
            this.nearbyPlaces = results;
          } else {
            this.nearbyPlaces = results;
            this.nearbyPlaces.sort((a: any, b: any) => a.distance - b.distance);
          }
          console.log(results);
          return resolve(results);
        } else { return reject(new Error('Some error occurred')); }
      });
    });
  }

  markNearbyMarkers(nearbyPlaces: google.maps.places.PlaceResult[]) {
    nearbyPlaces.map((elem) => {
      const image = {
        url: elem.icon,
        size: new google.maps.Size(20, 20),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32)
      };
      const marker = new google.maps.Marker({
        map: this.map,
        /*icon: image,*/
        title: elem.name,
        animation: google.maps.Animation.DROP,
        position: elem.geometry.location
      });
      const content = '<p>This is your current position !</p>';
      const infoWindow = new google.maps.InfoWindow({
        content: elem.name
      });

      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });
      const lat = elem.geometry.location.lat();
      const long = elem.geometry.location.lng();
      (elem as any).distance = haversineDistance([lat, long], [this.currentPos.coords.latitude, this.currentPos.coords.longitude], false);
    });
    nearbyPlaces.sort((a: any, b: any) => a.distance - b.distance);
  }

  getChaurahas() {
    let request = {
      fields: ["geometry", "icon", "name"],
      locationBias: "IP_BIAS",
      query: "Chauraha"
    }
    let circle = new google.maps.Circle({

    });
    console.log(request);
    this.placesService.findPlaceFromQuery(request, (results: google.maps.places.PlaceResult[], status) => {
      console.log(status);
      console.log(results);
    });
  }
}
