<template>
	<div class="loader-wrap" v-if="loading">
		<div class="background"></div>
		<div class="loader">Loading...</div>
	</div>
</template>
<script>
export default {
	props: ['loading']
}
</script>
<style lang="scss" scoped>
.loader-wrap {
	position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
	.background {
		position: absolute;
		height: 100%;
		width: 100%;
		opacity: 0.5;
		background: white;
	}
	.loader {
		position: relative;
		top: 50%;
		transform: translateX(100px);
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 200px;
		text-align: center;
		z-index: 10;
		font-weight: bold;
	}
}
</style>
