<template>
	<div>
		<div 
		v-for="(v, index) in options" 
		:key="index"
		@click="toggle(v)"
		:class="{active: v.value == selected}"
		class="option"
		>{{ v.label }}</div>
	</div>
</template>
<script>
export default {
	props: ['options', 'start'],
	data() {
		return {
			selected : 'n/a'
		}
	},
	methods: {
		toggle(option) {
			this.selected = option.value;
			this.$emit('input', option.value);
		}
	},
	watch: {
		start() {
			this.selected = this.start;
		}
	},
	mounted() {
		this.selected = this.start; // First time
	}

}
</script>
<style lang="scss" scoped>
.option {
	background-color: #b6b6b6;
    width: 35px;
    height: 25px;
    display: inline-block;
    margin-right: 5px;
    padding-top: 3px;
    color: white;
    text-align: center;
    font-weight: bold;
	cursor: pointer;
	transition: background-color 0.2s;
	&:hover {
		background-color: lighten(#087fc0, 15%);
	}
	&.active {
		background-color: #087fc0;
	}
	&:last-child{
		margin-right: 0px;
	}
}
	
</style>

