import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
import {Deck} from '@deck.gl/core';
import {PolygonLayer} from '@deck.gl/layers';
import {TextLayer} from '@deck.gl/layers';
import {PathLayer} from '@deck.gl/layers';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';


const AMRPOINTS ='./data.geojson';
const POLYDATA='./polydata.geojson';
const DISTDATA='./haryanadist.geojson';
const RIVER='./gangesriver.geojson';

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  center: [77.010991948061402, 28.868732811542801],
  zoom: 8,
  bearing: 0,
  pitch: 0
});

const polygonLayer = new PolygonLayer({
  id: 'PolygonLayer',
  data: POLYDATA,
  getPolygon: (d) => d.coordinates,
  getFillColor: (d) => [((d.censuscode - 70) * 8) + 55, 255, 102, 200],
  getLineColor: [255, 255, 255],
  getLineWidth: 20,
  lineWidthMinPixels: 1,
  pickable: true,
  controller: true,
  getTooltip: ({ object }) => object && `${object.DISTRICT}\ndistrict: ${object.DISTRICT}`,
  onClick: (info) => {
    if (info.object) {
      const { DISTRICT } = info.object;
      const message = `District: ${DISTRICT}`;
      alert(message);
    }
  },
});

const pathLayer = new PathLayer({
  id: 'PathLayer',
  data: RIVER,
  getColor: [0, 0, 255],
  getPath: (d) => d.coordinates,
  getWidth: 1000,
  pickable: true,
});

const textLayer = new TextLayer({
  id: 'TextLayer',
  data: DISTDATA,
  getPosition: (d) => d.coordinates,
  getText: (d) => d.DTNAME,
  getAlignmentBaseline: 'center',
  getColor: [2, 133, 10],
  getSize: 16,
  getTextAnchor: 'middle',
  pickable: true,
});

const amrpoints = new GeoJsonLayer({
  id: 'amrpoints',
  data: AMRPOINTS,
  filled: true,
  pointRadiusMinPixels: 2,
  pointRadiusScale: 200,
  getPointRadius: 5,
  getFillColor: [200, 0, 80, 180],
  pickable: true,
  autoHighlight: true,
  onClick: (info) => {
    if (info.object) {
      const { address } = info.object.properties;
      const message = `Address: ${address}`;
      alert(message);
    }
  },
});
const deckOverlay = new DeckOverlay({
  // interleaved: true,
  layers: [polygonLayer,pathLayer,textLayer, amrpoints]
});

map.addControl(deckOverlay);
map.addControl(new maplibregl.NavigationControl());
function updateLayers() {
  const layers = [];
    layers.push(polygonLayer);
  
  if (document.getElementById('pathLayerCheckbox').checked) {
    layers.push(pathLayer);
  }
  if (document.getElementById('textLayerCheckbox').checked) {
    layers.push(textLayer);
  }
  if (document.getElementById('geoJsonLayerCheckbox').checked) {
    layers.push(amrpoints);
  }
  
  deckOverlay.setProps({ layers });
}

// Initial call to set the layers based on checkbox states
updateLayers();

// Add event listeners to checkboxes to update layers on change

document.getElementById('pathLayerCheckbox').addEventListener('change', updateLayers);
document.getElementById('textLayerCheckbox').addEventListener('change', updateLayers);
document.getElementById('geoJsonLayerCheckbox').addEventListener('change', updateLayers);
