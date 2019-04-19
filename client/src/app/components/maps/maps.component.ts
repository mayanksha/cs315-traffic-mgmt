import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

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
  nearbyPlaces: any[];
  placeType: string;

  searchRadius = 1000;
  postEndpoint = 'http://localhost:8000/';

  trafficLights = {
    icon: "http://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/1024/traffic-light-icon.png",
    data: [],
    markers: [],
    clicked: false,
  }

  policeOfficers = {
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/police-71.png",
    data: [],
    markers: [],
    clicked: false,
  }

  accidents = {
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Explosion-155624_icon.svg/768px-Explosion-155624_icon.svg.png",
    data: [],
    markers: [],
    clicked: false,
  }

  currentPos = {
    coords: {
      latitude: 26.462189,
      longitude: 80.295909
    }
  };


  constructor(
    private http: HttpClient
  ) { }

  getLatLng() {
    return new google.maps.LatLng(this.currentPos.coords.latitude, this.currentPos.coords.longitude);
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

  markNearbyMarkers(nearbyPlaces: google.maps.places.PlaceResult[], icon: any) {
    nearbyPlaces.map((elem) => {
      const image = {
        url: icon,
        size: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(30, 30)
      };
      const marker = new google.maps.Marker({
        map: this.map,
        icon: image,
        title: elem.name,
        animation: google.maps.Animation.DROP,
        position: (typeof elem.geometry !== "undefined")
            ? elem.geometry.location 
            : new google.maps.LatLng((elem as any).coords.latitude, (elem as any).coords.longitude)
      });
      switch(icon) {
        case(this.trafficLights.icon): {
          this.trafficLights.markers.push(marker);
          break;
        };
        case(this.policeOfficers.icon): {
          this.policeOfficers.markers.push(marker);
          break;
        };
        case(this.accidents.icon): {
          this.accidents.markers.push(marker);
          break;
        };
      }
      const content = "<h3>Name: " + elem.name + "</h3><p>" + elem.formatted_address + "</p>";
      const infoWindow = new google.maps.InfoWindow({
        content: content 
      });

      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });
    });
  }

  async ngOnInit() {
    this.addMap();
  }

  async toggleTrafficLights() {
    if (!this.trafficLights.clicked) {
      if (this.trafficLights.data.length === 0) {
        this.trafficLights.data = this.trafficLights.data.concat(await this.getTrafficLights());
      }
      this.markNearbyMarkers(this.trafficLights.data, this.trafficLights.icon);
    } 
    else 
      this.trafficLights.markers.forEach((e: google.maps.Marker) => e.setMap(null))
    this.trafficLights.clicked = !this.trafficLights.clicked;
  }
  /*async toggleTrafficLights() {
   *  if (!this.trafficLights.clicked) {
   *    if (this.trafficLights.data.length === 0) {
   *      [>this.trafficLights.data = this.trafficLights.data.concat(await this.getTrafficLights());<]
   *      this.trafficLights.data = this.trafficLights.data.concat(await this.getQueryResults('Chauraha'));
   *      this.trafficLights.data = this.trafficLights.data.concat(await this.getQueryResults('Grounds'));
   *    }
   *    this.markNearbyMarkers(this.trafficLights.data, this.trafficLights.icon);
   *    let postData = {
   *      trafficLights: this.trafficLights.data.map((e: google.maps.places.PlaceResult) => {
   *        return {
   *          icon: this.trafficLights.icon,
   *          coords: {
   *            latitude: e.geometry.location.lat(),
   *            longitude: e.geometry.location.lng()
   *          },
   *          name: e.name,
   *          address: e.formatted_address
   *        };
   *      })
   *    }
   *    this.http.post(this.postEndpoint + "updateTrafficLights", postData)
   *      .toPromise()
   *      .then((val) => {
   *        console.log(val);
   *      })
   *      .catch(console.error);
   *  } 
   *  else 
   *    this.trafficLights.markers.forEach((e: google.maps.Marker) => e.setMap(null))
   *  this.trafficLights.clicked = !this.trafficLights.clicked;
   *}*/

  async togglePoliceOfficers() {
    if (!this.policeOfficers.clicked) {
      if (this.policeOfficers.data.length === 0) {
        this.policeOfficers.data = this.policeOfficers.data.concat(await this.getQueryResults('Chauraha'));
      }
      /*this.policeOfficers.data = this.policeOfficers.data.concat(await this.getQueryResults('Grounds'));*/
      this.markNearbyMarkers(this.policeOfficers.data, this.policeOfficers.icon);
    } 
    else 
      this.policeOfficers.markers.forEach((e: google.maps.Marker) => e.setMap(null))
    this.policeOfficers.clicked = !this.policeOfficers.clicked;
  }

  async toggleAccidents() {
    if (!this.accidents.clicked) {
      if (this.accidents.data.length === 0) {
        this.accidents.data = this.accidents.data.concat(await this.getQueryResults('Restaurants'));
      }
      /*this.accidents.data = this.accidents.data.concat(await this.getQueryResults('Grounds'));*/
      this.markNearbyMarkers(this.accidents.data, this.accidents.icon);
    } 
    else 
      this.accidents.markers.forEach((e: google.maps.Marker) => e.setMap(null))
    this.accidents.clicked = !this.accidents.clicked;
  }

  async addMap() {
    const mapOptions = {
      center: new google.maps.LatLng(this.currentPos.coords.latitude, this.currentPos.coords.longitude),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElem.nativeElement, mapOptions);
    this.addMarker();
    this.placesService = new google.maps.places.PlacesService(this.map);
  }

  async getQueryResults(searchQuery: string): Promise<any> {
    let request = {
      location: this.getLatLng(),
      radius: 10000,
      query: searchQuery 
    };
    return new Promise((resolve, reject) => {
      this.placesService.textSearch(request, (results: google.maps.places.PlaceResult[], status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK)
          return resolve(results);
        else
          return reject(status);
      });
    })
  }

  async getTrafficLights() {
    return this.http.get(this.postEndpoint + 'getTrafficLights').toPromise();
  }
}
