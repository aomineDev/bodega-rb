import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VMaskInput } from 'vuetify/labs/VMaskInput'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { es } from 'vuetify/locale'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export const vuetify = createVuetify({
  components: {
    ...components,
    VMaskInput,
    VDateInput,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  defaults: {
    VTextField: {
      variant: 'underlined',
    },
    VSelect: {
      variant: 'underlined',
    },
    VDateInput: {
      variant: 'underlined',
    },
  },
  locale: {
    locale: 'es',
    messages: { es },
  },
  date: {
    locale: {
      es: 'es-PE',
    },
  },
})
