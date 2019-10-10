# Clappr thumbnails plugin

At first this project was a clone of the [Tom Jenkinson's clappr thumbnails plugin](https://github.com/tjenkinson/clappr-thumbnails-plugin), a lot of the current code was written by he.

Diferrences between this and the original plugin:

Lazy-load (original loaded every image at once).
One image at a time (original showed just like a gallery).
Lazy-load thumbnail request url:


## Parameters

`getThumbnailForTime` - Function that will be called once a thumbnail will be shown,
the function argument will be the time where the user has hovered (in milliseconds), and the function must return the url where it should look for the image

`roundBase` - (default is 5) Number to round the seconds to, example, if the `roundBase` is 5, once the user hovers `29 seconds`,
your function will be called as it was just `25 seconds`.

## Example
```javascript
var player = new Clappr.Player({
    source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    parentId: "#player",
    plugins: {
        core: [ClapprThumbnailsPlugin],
    },
    thumbnailPlugin: {
        getThumbnailForTime: time => `https://mycdn.com/my-awesome-video/thumb-at-${time}.jpg`
    }
});
```


