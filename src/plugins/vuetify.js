import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VMaskInput } from 'vuetify/labs/VMaskInput'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
export const vuetify = createVuetify({
  components: {
    ...components,
    VMaskInput,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  defaults: {
    VTextField: {
      variant: 'underlined',
    },
  },
})
