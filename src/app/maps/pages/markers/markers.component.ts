import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarkerColor {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styles: [
    `
    .map-container {
      height: 100%;
      width: 100%;
    }

    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }
    li {
      cursor: pointer;
    }
    `
  ]
})
export class MarkersComponent implements AfterViewInit {

  @ViewChild('map') divMap!: ElementRef
  map!: mapboxgl.Map;
  zoomLevel: number = 16;
  center: [number, number] = [2.176333014914384, 41.404311707558456];
  
  constructor() { }

  //markers array
  markers: MarkerColor[] = [];


  ngAfterViewInit(): void {

    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });
    this.readLocalStorage()
    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola Mundo';

    // const marker = new mapboxgl.Marker()
    //   .setLngLat(this.center)
    //   .addTo(this.map)
  }

  addMarker() {

    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat(this.center)
      .addTo(this.map);

    this.markers.push({
      color,
      marker: newMarker
    })

    this.saveMarkerLocalStorage()

    newMarker.on('dragend', () => {
      this.saveMarkerLocalStorage();
    })
  }

  goToMarker( marker: mapboxgl.Marker ) {
    this.map.flyTo({
      center: marker.getLngLat()
    })
  }

  saveMarkerLocalStorage() {

    const lngLatArr: MarkerColor[] = [];

    this.markers.forEach( m => {

      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      lngLatArr.push({
        color: color,
        center: [ lng, lat ]
      })

      localStorage.setItem('markers', JSON.stringify(lngLatArr))

    })
  }

  readLocalStorage() {

    if (!localStorage.getItem('markers')) {
      return;
    }

    const lngLatArr: MarkerColor[] = JSON.parse(localStorage.getItem('markers')!);

    lngLatArr.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
      .setLngLat(m.center!)
      .addTo(this.map);

      this.markers.push({
        marker: newMarker,
        color: m.color
      });

      newMarker.on('dragend', () => {
        this.saveMarkerLocalStorage();
      })
    })

  }

  deleteMarker(i: number) {
    this.markers[i].marker?.remove();
    this.markers.splice(i, 1);
    this.saveMarkerLocalStorage();
  }

}
