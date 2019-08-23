# Clappr thumbnails plugin

At first this project was a clone of the [Tom Jenkinson's clappr thumbnails plugin](https://github.com/tjenkinson/clappr-thumbnails-plugin), a lot of the current code was written by he.

Diferrences between this and the original plugin:

Lazy-load (original loaded every image at once).
One image at a time (original showed just like a gallery).
Lazy-load thumbnail request url:

```
thumbnailPlugin: {
    getThumbnailForTime: time => `https://mycdn.com/thumb/mylive/thumb-at-${Math.round(time * 1000)}.jpg`
}
```


