<template>
  <view>
    <view class="u-text-right" @click="showCondPicker = true">{{ dateCondParent || dateCond }}<u-icon name="arrow-down" class="u-padding-left-16"></u-icon></view>
    <u-picker
      mode="selector"
      v-model="showCondPicker"
      confirm-color="#31C37B"
      :default-selector="[condIndex]"
      :range="selectorObj"
      range-key="cateName"
      @confirm="confirmDateRange"
    />
    <u-calendar
      v-model="showCalendar"
      active-bg-color="#31C37B"
      active-color="#FFFFFF"
      range-bg-color="rgba(49, 195, 123, 0.2)"
      range-color="#31C37B"
      btn-type="success"
      mode="range"
      @change="changeCalendar"
    />
  </view>
</template>

<script>
  import dayjs from 'dayjs'
  import { dateCondAll } from "@/constants"
  
  export default {
    name: 'PageDateCond',
    props: {
      dateCondParent: {
        type: String,
        default: '今天'
      },
      setParentDateCond: {
        type: Function,
        default: null
      },
    },
    data() {
      return {
        dateCond: '今天',
        // 今天、昨天、近7天、近30天、自定义
        showCondPicker: false,
        condIndex: 0,
        selectorObj: [],
        showCalendar: false,
      }
    },
    mounted() {
      this.selectorObj = dateCondAll
    },
    methods: {
      changeCalendar(e) {
        console.log(e)
        this.selectorObj[this.condIndex].dateFrom = e.startDate
        this.selectorObj[this.condIndex].dateTo = e.endDate
        this.dateCond = e.startDate + ' ~ ' + e.endDate
        
        this.$emit('setParentDateCond', this.dateCond, e.startDate, e.endDate )
      },
      confirmDateRange(e) {
        const pIndex = e[0]
        this.condIndex = pIndex
        
        if(pIndex == 4 && this.selectorObj[pIndex].cateName == '自定义') {
          this.showCalendar = true
        } else {
          this.dateCond = this.selectorObj[pIndex].cateName
          this.$emit('setParentDateCond', this.selectorObj[pIndex].cateName, this.selectorObj[pIndex].dateFrom, '')
          // this.$emit('setParentDateCond', this.selectorObj[pIndex].cateName)
        }
      },
    }
  }
</script>

<style>

</style>
