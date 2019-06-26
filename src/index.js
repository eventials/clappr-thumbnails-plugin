import {UICorePlugin, Styler, Events, template, $} from 'clappr'
import {Promise} from 'es6-promise-polyfill'
import pluginHtml from './public/thumbnails-plugin.html'
import pluginStyle from './public/style.sass'

export default class ScrubThumbnailsPlugin extends UICorePlugin {

  get name() { return 'thumbnails-plugin' }

  get attributes() {
    return {
      'class': this.name
    }
  }
  get template() { return template(pluginHtml) }

  constructor(core) {
    super(core)
    this.show = false
    this.hoverPosition = 0
    this._oldContainer = null
    this.parent = this.$el.parent()
  }

  bindEvents() {
    // Clappr 0.3 support
    if (Events.CORE_ACTIVE_CONTAINER_CHANGED) {
      this.listenTo(this.core, Events.CORE_ACTIVE_CONTAINER_CHANGED, this.rebindEvents)
    }
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_MOUSEMOVE_SEEKBAR, this.onMouseMove)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_MOUSELEAVE_SEEKBAR, this.onMouseLeave)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.init)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.bindContainerEvents)
  }

  rebindEvents() {
    this.stopListening()
    this.bindEvents()
  }

  bindContainerEvents() {
    if (this._oldContainer) {
      this.stopListening(this._oldContainer, Events.CONTAINER_TIMEUPDATE, this.renderPlugin)
    }
    this._oldContainer = this.core.mediaControl.container
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_TIMEUPDATE, this.renderPlugin)
  }

  init() {
    this.createElements()
    this.renderPlugin()
  }

  getOptions() {
    if (!("thumbnailPlugin" in this.core.options)) {
      throw "'thumbnailPlugin' property missing from options object."
    }
    return this.core.options.thumbnailPlugin
  }

  appendElToMediaControl() {
    // insert after the background
    this.core.mediaControl.$el.find(".media-control-background").first().after(this.el)
  }

  onMouseMove(e) {
    this.calculateHoverPosition(e)
    this.show = true
    this.renderPlugin()
  }

  onMouseLeave() {
    this.show = false
    this.renderPlugin()
  }

  calculateHoverPosition(e) {
    const offset = e.pageX - this.core.mediaControl.$seekBarContainer.offset().left
    // proportion into the seek bar that the mouse is hovered over 0-1
    this.hoverPosition = Math.min(1, Math.max(offset/this.core.mediaControl.$seekBarContainer.width(), 0))
  }

  buildImg(thumbUrl) {
    const $img = $("<img />").addClass("thumbnail-img").attr("src", thumbUrl)

    // the container will contain the image positioned so that the correct sprite
    // is visible
    const $container = $("<div />").addClass("thumbnail-container")
    $container.append($img)
    return $container
  }

  // calculate how far along the carousel should currently be slid
  // depending on where the user is hovering on the progress bar

  updateSpotlightThumb() {
    const { hoverPosition, $spotlight, previousTime } = this
    const videoDuration = this.core.mediaControl.container.getDuration()
    // the time into the video at the current hover position
    const startTimeOffset = this.core.mediaControl.container.getStartTimeOffset()
    const hoverTime = Math.floor((startTimeOffset + (videoDuration * hoverPosition)) / 5) * 5
    const elWidth = this.$el.width()
    const thumbWidth = $spotlight.width()

    const spotlightXPos = Math.max(Math.min((elWidth * hoverPosition) - (thumbWidth / 2), elWidth - thumbWidth), 0)

    $spotlight.css("left", spotlightXPos)
    if (hoverTime === previousTime) return

    this.previousTime = hoverTime

    const thumbUrl = this.core.options.thumbnailPlugin.getThumbnailForTime(hoverTime)

    $spotlight.empty()
    $spotlight.append(this.buildImg(thumbUrl, this.getOptions().spotlightHeight))

  }

  renderPlugin() {
    if (this.show) {
      if (!this.parent.length) {
        this.parent = this.$el.parent()
      }
      if (this.parent[0]) {
        this.parent[0].appendChild(this.$el[0])
        this.updateSpotlightThumb()
      }
    } else {
        if (this.$el.parent()[0]) {
            // first time the parent doesn't exist but the `$el.parent` does
            this.parent = this.$el.parent()
            this.parent[0].removeChild(this.$el[0])
        }
    }
  }

  createElements() {
    this.$el.html(this.template())

    this.$el.append(Styler.getStyleFor(pluginStyle))

    this.$spotlight = this.$el.find(".spotlight")
    this.appendElToMediaControl()
  }
}
