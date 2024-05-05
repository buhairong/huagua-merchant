<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="h5url"></web-view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        h5url: '',
        webviewStyles: {
          progress: {
            color: '#0AEB7D'
          }
        }
      }
    },
    onLoad(options) {
      console.log(options)
      // let uri = options.h5uri
      // let url = ''
      // if (uri) {
      //   url = decodeURIComponent(uri)
      // } else {
      //   let tstr = new Date().getTime()
      //   url = options.h5url + '?ts='+tstr
      // }
      let tstr = new Date().getTime()
      let url = options.h5url + '?ts='+tstr
      this.h5url = options.h5url + '?ts='+tstr
      uni.setNavigationBarTitle({
        title: options.title
      })
      console.log('h5url',this.h5url)
      console.log('title',options.title)
    },
    methods: {
      
    }
  }
</script>

<style>

</style>
