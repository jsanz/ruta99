# Ruta 99 viewer

This is a minimal website to render [ruta 99]() points.


## Get the GeoJSON with the coordinates

Use this command with `jq` to generate the `src/assets/puntos.geo.json` file


```bash
curl 'https://visorruta99.tragsa.es/capas.aspx?idCapa=MunicipiosC' | 
    jq -c '{"type": "FeatureCollection", "features": [ .[] | { "geometry": { "type": "Point", "coordinates": [ .coordx, .coordy ] }, "properties": { "ine": .codigoine, "name": .nombre } } ]}' \
    >> src/assets/js/puntos.geo.json

```