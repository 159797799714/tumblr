<!--本页面由uniapp切片工具生成，uni-app切片-可视化设计工具(一套代码编译到7个平台iOS、Android、H5、小程序)，软件下载地址：http://www.ymznkf.com/new_view_669.htm -->
<template>
	<view class="content">
			<view class="about_60">
				<view class="about_61">
					<image v-on:click="about_15_15_click()"  src="/static/about/images/about_15_15.jpg" mode="scaleToFill" border="0"    class="about_15"></image>
				</view>
				<view class="about_40">
					<text decode="true" class="about_41">访问官网</text>
					<image v-on:click="about_42_42_click()"  src="/static/about/images/about_42_42.jpg" mode="scaleToFill" border="0"    class="about_42"></image>
				</view>
				<text decode="true" class="about_43">www.*****.com</text>
				<view class="about_44">
					<text decode="true" class="about_45">抖音官方邮箱</text>
					<button v-on:click="btCopy_46_click()" class="btCopy">点击复制
					</button>
					<image v-on:click="about_47_47_click()"  src="/static/about/images/about_47_47.jpg" mode="scaleToFill" border="0"    class="about_47"></image>
				</view>
				<text decode="true" class="about_48">eeaback(@****.com</text>
				<text decode="true" class="about_50">客户服务热线</text>
				<text decode="true" class="about_52">00-992-88888</text>
				<view class="about_53">
					<text decode="true" class="about_54">违法和不良信息举报电话</text>
					<image v-on:click="about_55_55_click()"  src="/static/about/images/about_55_55.jpg" mode="scaleToFill" border="0"    class="about_55"></image>
				</view>
				<text decode="true" class="about_56">00-140-22222</text>
				<text decode="true" class="about_58">营业执照</text>
				<view class="about_49">
					<image v-on:click="about_51_51_click()"  src="/static/about/images/about_51_51.jpg" mode="scaleToFill" border="0"    class="about_51"></image>
				</view>
				<view class="about_57">
					<image v-on:click="about_59_59_click()"  src="/static/about/images/about_59_59.jpg" mode="scaleToFill" border="0"    class="about_59"></image>
				</view>
				<view class="about_62">
					<image v-on:click="about_22_22_click()"  src="/static/about/images/about_22_22.jpg" mode="scaleToFill" border="0"    class="about_22"></image>
					<text decode="true" class="about_35">品牌</text>
					<text decode="true" class="about_36">v9. 4.0 Build xiaomi 6b12b21 20200323</text>
				</view>
			</view>
		

		<view class="loading">{{loadingText}}</view>
		<view class="ymBbottom"></view>
	</view>
</template>

<script>
import about from "./about.js";
export default about;
</script>

<style lang="scss" scoped>
   @import './about.scss'
</style>