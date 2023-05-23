<template>
  <view>
      <web-view :src="url"></web-view>
  </view>
</template>

<script>
  import _data from '../../common/_data';
  export default {
    data() {
      return {
        url:''
      }
    },
    onShow() {
      this.url = _data.data('bottom_url');
      console.log( this.url);
    },
    methods: {
      
    }
  }
</script>

<style>

</style>

