import { defineComponent, h } from "vue"
import { useQuasar } from "quasar"

import useModelToggle, { useModelToggleProps, useModelToggleEmits } from "quasar/src/composables/private/use-model-toggle.js"


export default defineComponent({
  name: "QPdfviewer",

  props: {
    src: String,
    type: {
      type: String,
      default: "html5",
      validator: (v) => ["html5", "pdfjs"].indexOf(v) !== -1,
    },
    errorString: {
      type: String,
      default:
        "This browser does not support PDFs. Download the PDF to view it:",
    },
    contentStyle: [String, Object, Array],
    contentClass: [String, Object, Array],
    innerContentStyle: [String, Object, Array],
    innerContentClass: [String, Object, Array],

    ...useModelToggleProps,
  },

  emits: [
    ...useModelToggleEmits
  ],

  data() {
    return {
        hashId: "q-pdfviewer-" + Math.random().toString(36).substr(2, 9)
    }
  },

  render(prop) {
    const $q = useQuasar()

    function __renderObject () {
        return h('object', {
          class: [prop.innerContentClass],
          style: [prop.innerContentStyle],
          id: prop.hashId,
          data: prop.src,
          type: 'application/pdf',
          width: '100%',
          height: '100%'
        }, [
          // browser object not supported, try iframe
          __renderIFrame()
        ])
      }

    function __renderIFrame () {
        return h('iframe', {
          class: ['q-pdfviewer__iframe'],
          src: prop.src,
          width: '100%',
          height: '100%'
        }, [
          // iframe not supported either, give user a link to download
          __renderText()
        ])
      }

    function __renderIFramePDFJS () {
        return h('iframe', {
          class: ['q-pdfviewer__iframe'],
          src: 'pdfjs/web/viewer.html?file=' + encodeURIComponent(prop.src)
        }, [
          // iframe not supported either, give user a link to download
          __renderText()
        ])
      }

    function __renderText () {
        // TODO: ????
        /*return h('p',
          'This browser does not support PDFs. Download the PDF to view it:', [
          h('a', {
            href: prop.src,
            target: '_blank'
          })
        ])*/
        return h('a', {
            href: prop.src,
            target: '_blank'
          })
      }

    if (prop.src !== void 0 && prop.src.length > 0) {
        return h(
          "div",
          {
            class: ["q-pdfviewer", prop.contentClass],
            style: [prop.contentStyle],
          },
          [
            $q.platform.is.electron || prop.type === "pdfjs"
              ? __renderIFramePDFJS(h)
              : __renderObject(h),
          ]
        );
      }
      return "";
  },

  setup() {
    return {
      ...useModelToggle
    }
  }
})
