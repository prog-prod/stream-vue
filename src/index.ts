import { defineComponent, ref } from 'vue'

const scriptLocation =
  'https://embed.videodelivery.net/embed/r4xu.fla9.latest.js'

export type HTMLStreamElement = HTMLScriptElement

declare global {
  interface Window {
    __stream?: {
      init: () => void
      initElement: (streamElement: HTMLStreamElement) => void
    }
  }
}

export type Events =
  /**
   * Sent when playback is aborted; for example, if the media is playing and is restarted from the beginning, this event is sent.
   */
  | 'abort'
  /**
   * Sent when enough data is available that the media can be played, at least for a couple of frames.
   */
  | 'canplay'
  /**
   * Sent when the entire media can be played without interruption, assuming the download rate remains at least at the current level. It will also be fired when playback is toggled between paused and playing. Note: Manually setting the currentTime will eventually fire a canplaythrough event in firefox. Other browsers might not fire this event.
   */
  | 'canplaythrough'
  /**
   * The metadata has loaded or changed, indicating a change in duration of the media. This is sent, for example, when the media has loaded enough that the duration is known.
   */
  | 'durationchange'
  /**
   * Sent when playback completes.
   */
  | 'ended'
  /**
   * Sent when an error occurs. (e.g. the video has not finished encoding yet, or the video fails to load due to an incorrect signed URL)
   */
  | 'error'
  /**
   * The first frame of the media has finished loading.
   */
  | 'loadeddata'
  /**
   * The media’s metadata has finished loading; all attributes now contain as much useful information as they’re going to.
   */
  | 'loadedmetadata'
  /**
   * Sent when loading of the media begins.
   */
  | 'loadstart'
  /**
   * Sent when the playback state is changed to paused (paused property is true).
   */
  | 'pause'
  /**
   * Sent when the playback state is no longer paused, as a result of the play method, or the autoplay attribute.
   */
  | 'play'
  /**
   * Sent when the media has enough data to start playing, after the play event, but also when recovering from being stalled, when looping media restarts, and after seeked, if it was playing before seeking.
   */
  | 'playing'
  /**
   * Sent periodically to inform interested parties of progress downloading the media. Information about the current amount of the media that has been downloaded is available in the media element’s buffered attribute.
   */
  | 'progress'
  /**
   * Sent when the playback speed changes.
   */
  | 'ratechange'
  /**
   * Sent when a seek operation completes.
   */
  | 'seeked'
  /**
   * Sent when a seek operation begins.
   */
  | 'seeking'
  /**
   * Sent when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.
   */
  | 'stalled'
  /**
   * Sent when loading of the media is suspended; this may happen either because the download has completed or because it has been paused for any other reason.
   */
  | 'suspend'
  /**
   * The time indicated by the element’s currentTime attribute has changed.
   */
  | 'timeupdate'
  /**
   * Sent when the audio volume changes (both when the volume is set and when the muted attribute is changed).
   */
  | 'volumechange'
  /**
   * Sent when the requested operation (such as playback) is delayed pending the completion of another operation (such as a seek).
   */
  | 'waiting'
  /**
   * Fires when ad-url attribute is present and the ad begins playback
   */
  | 'stream-adstart'
  /**
   * Fires when ad-url attribute is present and the ad finishes playback
   */
  | 'stream-adend'
  /**
   * Fires when ad-url attribute is present and the ad took too long to load.
   */
  | 'stream-adtimeout'

export const VideoStream = defineComponent({
  name: 'VideoStream',
  props: {
    autoplay: { type: Boolean, default: false },
    controls: { type: Boolean, default: false },
    currentTime: { type: Number, default: 0 },
    height: { type: [String, Number] },
    width: { type: [String, Number] },
    muted: { type: Boolean, default: false },
    loop: { type: Boolean, default: false },
    preload: {
      type: [String, Boolean] as unknown as () =>
        | 'auto'
        | 'metadata'
        | 'none'
        | boolean,
    },
    volume: { type: Number, default: 1 },
  },
  setup(props, { emit }) {
    const streamScript = ref<HTMLScriptElement | null>(null)

    const initialiseStream = () => {
      if (!streamScript.value) {
        const script = document.createElement('script')
        script.setAttribute('data-cfasync', 'false')
        script.setAttribute('defer', 'true')
        script.setAttribute('type', 'text/javascript')
        script.setAttribute('src', scriptLocation)
        document.head.appendChild(script)

        streamScript.value = script
      }

      if (window.__stream && streamScript.value) {
        window.__stream.initElement(streamScript.value as HTMLStreamElement)
      }
    }

    return {
      initialiseStream,
      streamScript,
    }
  },
  mounted() {
    this.initialiseStream()
  },
  watch: {
    autoplay: function (val: any) {
      this.updateProp('autoplay', val)
    },
    controls: function (val: any) {
      this.updateProp('controls', val)
    },
    currentTime: function (val: any) {
      this.updateProp('currentTime', val)
    },
    muted: function (val: any) {
      this.updateProp('muted', val)
    },
    loop: function (val: any) {
      this.updateProp('loop', val)
    },
    volume: function (val: any) {
      this.updateProp('volume', val)
    },
    preload: function (val: any) {
      this.updateProp('preload', val)
    },
  },
  methods: {
    updateProp(key: string, value: any) {
      if (!this.$refs.stream) return
      ;(this.$refs.stream as any)[key] = value
    },
  },
})
