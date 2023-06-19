<template>
	<div class="hamburger" :style="{'zIndex':isActive?'2000':'100'}" @click="toggleClick" :class="{'opened':isActive}" >
		<icon name="angle-right" class="icon"  ></icon>
	</div>
</template>

<script>
export default {
  name: 'hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.hamburger {
	cursor: pointer;
	position: fixed;
	height: 100px;
	left:56px;
	width: 0;
	top:50%;

	margin-top: -20px;
	box-sizing: content-box;
	border-left: 10px solid #d7dde4;
	border-top: 20px solid #fff;
	border-bottom: 20px solid #fff;
	transform: rotateY(0deg);
	transform-origin: left center;
	/*transition: .2s all linear;*/
}
.icon{
	position: absolute;
	left:-14px;
	top:50%;
	transform: translateY(-50%) rotate(0deg);
	/*color: #29AFE3;*/
	color: #909399;
	width:18px;
	height:18px;
	transition: .38s;
	transform-origin: 50% 50%;
}
.icon.is-active {
	transform: translateY(-50%) rotateY(180deg);
}
.opened{
	transform: rotateY(-180deg);
	transform-origin: left center;
	/*transition: .2s all linear;*/
	left:155px;
}
</style>
