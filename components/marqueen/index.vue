<template>
	<view class="noticeBarBox" @click="$emit('click')">
		<zs-marqueen label="公告:" height="50rpx" :scrollamount="2" :title="noticeStr"></zs-marqueen>
	</view>
</template>

<script>
	import ZsMarqueen from '../zs-marquee/zs-marquee.vue';
	export default {
		components: {
			'zs-marqueen': ZsMarqueen,
		},
		data() {
			return {
				noticeStr: '',
			};
		},
		props: {
			notice: {
				type: Array,
				default: [],
			}
		},
		mounted() {
			this.init();
		},
		watch: {
			notice() {
				this.init();
			} 
		},
		methods: {
			init() {
				this.noticeStr= this.notice.join(" ");
			}
		}
	}
</script>

<style lang="less">
	.noticeBarBox {
		
	}
</style>