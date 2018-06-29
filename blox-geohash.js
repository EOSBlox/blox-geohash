import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `blox-geohash`
 * creates a geohash from the users location
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class BloxGeohash extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'blox-geohash',
      },
    };
  }

  getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            const options = {
                enableHighAccuracy: true,
                timeout: 7000,
                maximumAge: 0,
            };
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (err) => {
                    resolve(Error(err));
                },
                options);
        }
    });
}

toGeohash(latitude, longitude) {
  return new Promise((resolve, reject) => {
      const ratio = [16, 8, 4, 2, 1];
      const thirtyTwoBits = '0123456789bcdefghjkmnpqrstuvwxyz';
      const geoFence = [];
      let values = [longitude / 180 * 100, latitude / 90 * 100];
      for (let i = 0; i < values.length; i++) {
          geoFence[i] = [-100, 100];
      }
      let geoHash = '';
      let number = 0;
      let character = 0;
      let i = 0;

      while (geoHash.length < 10) {
          const iteration = i++ % values.length;
          const distance = geoFence[iteration];
          const value = values[iteration];
          const mean = (distance[0] + distance[1]) / 2;

          if (value > mean) {
              character |= ratio[number];
              distance[0] = mean;
          } else {
              distance[1] = mean;
          }

          if (number < 4) {
              number++;
          } else {
              geoHash += thirtyTwoBits[character];
              number = 0;
              character = 0;
          }
      }
      resolve(geoHash);
  });
}

_toLatLon(geoHash) {
  return new Promise((resolve, reject) => {
      const ratio = [16, 8, 4, 2, 1];
      const thirtyTwoBits = '0123456789bcdefghjkmnpqrstuvwxyz';
      const geoFence = [];

      for (let i = 0; i < 2; i++) {
          geoFence[i] = [-100, 100];
      }
      let iteration = 0;

      for (let i = 0; i < geoHash.length; i++) {
          for (let x = 0; x < ratio.length; x++) {
              let distance = geoFence[iteration++ % geoFence.length];
              let side = thirtyTwoBits
                  .indexOf(geoHash[i]) & ratio[x] ? 0 : 1;
              distance[side] = (distance[0] + distance[1]) / 2;
          }
      }

      const mean = [];
      for (let i = 0; i < geoFence.length; i++) {
          mean[i] = (geoFence[i][0] + geoFence[i][1]) / 2;
      }
      resolve({
          latitude: mean[1] / 100 * 90,
          longitude: mean[0] / 100 * 180,
      });
  });
}

_distance(latA, lonA, latB, lonB) {
  return new Promise((resolve, reject) => {
      let phi1 = this._radians(latA);
      let phi2 = this._radians(latB);
      let deltaPhi = this._radians(latB - latA);
      let deltaLambda = this._radians(lonB - lonA);
      let amp = Math.sin(deltaPhi / 2.0) * Math.sin(deltaPhi / 2.0) +
          Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) *
          Math.sin(deltaLambda / 2);
      let circ = 2 * Math.atan2(Math.sqrt(amp), Math.sqrt(1 - amp));
      resolve(Math.round(circ * 6371000));
  });
}

_radians(degrees) {
  return (degrees * Math.PI / 180);
}

} window.customElements.define('blox-geohash', BloxGeohash);
