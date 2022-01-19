import supported from '@mapbox/mapbox-gl-supported';

import { Map, Marker, Popup, NavigationControl, FullscreenControl, AttributionControl} from 'maplibre-gl';
import style from './icv-gris.json';
import points from './puntos.geo.json';


class InfoToggle {
    constructor() {
        const closeEl = document.querySelector('.details-modal-close svg');
        closeEl.onclick = () => {
            this.toggle();
        }
    }

    toggle(){
        const divEl = document.getElementById('info-content');
        divEl.classList.toggle('hidden');
        divEl.classList.toggle('details-modal');
    }

    onAdd(map) {
        this._map = map;
        let _this = this; 

        this._btn = document.createElement('button');
        this._btn.className = 'maplibregl-ctrl-icon maplibregl-ctrl-info';
        this._btn.type = 'button';
        this._btn['aria-label'] = 'Toggle Info';
        this._btn.textContent = "📖";
        this._btn.onclick = function() { 
            _this.toggle();
        };
        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
        this._container.appendChild(this._btn);
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

// Convert a town name into a url slug
const normalizeMunicipalityName = (name) => {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/gi, "-");
};

// Generate markers for each GeoJSON feature
const loadPoints = (map) => {
    // add markers to map
    for (const feature of points.features) {
        const name = feature.properties.name ;
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';
        const url = "https://www.ruta99.gva.es/" + normalizeMunicipalityName(name);

        new Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<h3><a target="_blank" href="${url}">${feature.properties.name}</a></h3>`
                    )
            )
            .addTo(map);
    }

}

// Creates a map with the ICV style
const loadMap = () => {
    // Labels to show on the corner
    const customAttribution = [
        '<a href="https://www.ruta99.gva.es" target="_blank">Ruta 99</a>',
        '<a href="https://icv.gva.es/" target="_blank">Institut Cartogràfic Valencià</a>',
        '<a href="https://gva.es" target="_blank">Generalitat Valenciana</a>',
    ].join('&nbsp;|&nbsp;');

    var map = new Map({
        container: 'map',
        minZoom: 6,
        maxZoom: 11,
        maxBounds: [
            [-5,37], 
            [5,41]
        ],
        attributionControl: false,
        style
    });

    // Attribution control
    map.addControl(new AttributionControl({
        compact: false,
        customAttribution
    }),'bottom-right');

    // Navigation control
    map.addControl(new NavigationControl({
        "showCompass": false
    }), 'top-left');

    // Full screen control
    map.addControl(new FullscreenControl({
        container: document.querySelector('body')
    }),'top-left');
    // Info control
    map.addControl(new InfoToggle(),'top-right');

    return map;
}


document.addEventListener('DOMContentLoaded', function () {
    if (supported.supported()) {
        const map = loadMap();
        loadPoints(map);
    } else {
        alert('Browser not supported!');
    }
});