# \<blox-geohash\>

creates a geohash from the users location

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.


## Install blox-geohash

```
$ npm install blox-geohash
```

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

## Import

```
$ import 'blox-geohash';
```

## Javascript get location

```html
<blox-geohash id="bloxGeohash"></blox-geohash>
<script>
    this.$.bloxGeohash.getLocation()
    .then((response) => {
        return this.$.bloxGeohash.toGeohash(response.latitude, response.longitude)
    })
    .then((geohash) => {
        // Do Something
    })
    .catch((err) => {
        // Do Something
    })
</script>
```