<template>
  <div v-if="flagImgUrl !== ''">
    <div v-if="name.length > defaultLength">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-row
            align="start"
            justify="center"
            class="px-0 py-0 mx-0 my-0"
            v-bind="attrs"
            v-on="on"
          >
            <v-col
              cols="auto"
              class="px-0 py-0 mx-0 my-0"
            >
              <v-img
                :width="countryFlagWidth"
                :height="countryFlagHeight"
                :src="flagImgUrl"
                class="mt-1"
              />
            </v-col>
            <v-col class="px-0 py-0 ml-1 my-0">
              <span>{{ formattedCountryName }}</span>
            </v-col>
          </v-row>
        </template>
        <span>{{ name.toUpperCase() }}</span>
      </v-tooltip>
    </div>
    <div v-else>
      <v-row
        align="start"
        justify="center"
        class="px-0 py-0 mx-0 my-0"
      >
        <v-col
          cols="auto"
          class="px-0 py-0 mx-0 my-0"
        >
          <v-img
            :width="countryFlagWidth"
            :height="countryFlagHeight"
            :src="flagImgUrl"
            class="mt-1"
          />
        </v-col>
        <v-col class="px-0 py-0 ml-1 my-0">
          <span>{{ formattedCountryName }}</span>
        </v-col>
      </v-row>
    </div>
  </div>
  <div v-else>
    <span>{{ name.toUpperCase() }}</span>
  </div>
</template>

<script>
import { find } from 'lodash'
import { CODES } from '../utils/country-codes'
import cellRenderMixin from 'lib/mixins/cellRenderMixin'
import { AG_DEFAULT_COUNTRY_LEN } from '../utils/constants'
import { parseJSON, isEmptyArray, isValidString } from '../utils'

export default {
  name: 'CountryCellRenderer',
  mixins: [cellRenderMixin],
  props: {},
  data() {
    return {
      code: '',
      name: '',
      flagImgUrl: '',
      defaultLength: AG_DEFAULT_COUNTRY_LEN,
    }
  },
  computed: {
    // for supported width and height please refer to https://flagpedia.net
    countryFlagWidth() {
      if (this.params && !Number.isNaN(Number(this.params.countryFlagWidth))) {
        return Number(this.params.countryFlagWidth)
      } else {
        return 20
      }
    },
    countryFlagHeight() {
      if (this.params && !Number.isNaN(Number(this.params.countryFlagHeight))) {
        return Number(this.params.countryFlagHeight)
      } else {
        return 15
      }
    },
    formattedCountryName() {
      if (!this.name) return ''
      if (this.name.length <= AG_DEFAULT_COUNTRY_LEN) return this.name.toUpperCase()
      return `${this.name.toUpperCase().substring(0, AG_DEFAULT_COUNTRY_LEN)} ...`
    },
  },
  mounted() {
    if (this.params && this.params['colDef'] && this.params['data']) {
      let country =
        this.params['data'][this.params['colDef']['field']] || this.params['data']['COUNTRY']
      if (country) {
        if (typeof country === 'string' && country.indexOf('{') > -1) {
          const countryInfo = parseJSON(`${country}`.trim().replace(/'|&#39;|&quot;/g, '"'))
          this.code = countryInfo['COUNTRY_CODE'] || ''
          this.name = countryInfo['COUNTRY_NAME'] || countryInfo['COUNTRY'] || ''
        } else if (typeof country === 'object') {
          this.code = country['COUNTRY_CODE'] || ''
          this.name = country['COUNTRY_NAME'] || country['COUNTRY'] || ''
        } else {
          this.name = country
        }
      }
    }
    this.setFlagImg()
  },
  methods: {
    setFlagImg() {
      if (
        !isEmptyArray(CODES) &&
        isValidString(process.env.VUE_APP_FILE_SERVER) &&
        (this.name || this.code)
      ) {
        const fileServerUrl = process.env.VUE_APP_FILE_SERVER
        const codeItem = find(CODES, (item) => {
          return (
            item &&
            ((item['Name'] &&
              this.name &&
              item['Name'].toLowerCase() === this.name.toLowerCase()) ||
              (item['Alpha_2'] &&
                this.name &&
                item['Alpha_2'].toLowerCase() === this.code.toLowerCase()) ||
              (item['Alpha_3'] &&
                this.code &&
                item['Alpha_3'].toLowerCase() === this.code.toLowerCase()) ||
              (item['Numeric'] &&
                this.code &&
                item['Numeric'].toLowerCase() === this.code.toLowerCase()))
          )
        })
        if (codeItem && codeItem['Alpha_2']) {
          this.name = codeItem['Name'] || this.name
          this.flagImgUrl = `${fileServerUrl}/countries/flags/${this.countryFlagWidth}x${
            this.countryFlagHeight
          }/${codeItem['Alpha_2'].toLowerCase()}.png`
        }
      }
    },
  },
}
</script>
