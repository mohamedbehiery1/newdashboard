import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwaXRhcHAiLCJhIjoiY2tvN2s0bzh0MXduajJ4bHBkOHhkdncwMyJ9.dYrI7DfoQuXfyIofEsifbQ';
mapboxgl.setRTLTextPlugin(
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
    null,
    true // Lazy load the plugin
);

const createMap = (options) => {
    return new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/streets-v11',
        ...options,
    });
};

export default createMap;

export const mapControls = {
    navigationControl: _ => new mapboxgl.NavigationControl(),
    geolocationControl: _ => new mapboxgl.GeolocateControl(),
}