import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarkerColor {
  color: string;
  marker: mapboxgl.Marker;
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
    console.log(newMarker)
  }

  goToMarker( marker: mapboxgl.Marker ) {
    this.map.flyTo({
      center: marker.getLngLat()
    })
  }

  saveMarkerLocalStorage() {
    
  }

}
