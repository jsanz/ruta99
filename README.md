# Ruta 99 viewer

This is a minimal website to render [ruta 99]() points.

## Build and deploy

This site uses [parcel](https://parceljs.org/) for building and development. Just run `yarn install`  to download dependencies and then:

* `yarn build` will generate all assets in the `dist` folder for static serving
* `yarn start` will start a development server with hot loading

Deployment at <https://ruta99-map.jorgesanz.net> is handled by [Netlify](https://netlify.com).

[![Netlify Status](https://api.netlify.com/api/v1/badges/8c6f826f-1b20-4b34-a939-16e1914d87aa/deploy-status)](https://app.netlify.com/sites/ruta99-map/deploys)

## Get the GeoJSON with the coordinates

Use this command with `jq` to generate the `src/assets/puntos.geo.json` file


```bash
curl 'https://visorruta99.tragsa.es/capas.aspx?idCapa=MunicipiosC' | 
    jq -c '{"type": "FeatureCollection", "features": [ .[] | { "geometry": { "type": "Point", "coordinates": [ .coordx, .coordy ] }, "properties": { "ine": .codigoine, "name": .nombre } } ]}' \
    >> src/assets/js/puntos.geo.json

```
