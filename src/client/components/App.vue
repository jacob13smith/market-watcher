<template>
	<v-app>
			<div>
			<transition :name="transition" mode="out-in">
				<router-view></router-view>
			</transition>
			</div>
	</v-app>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
	computed: mapGetters(['transition'])
}
</script>
<style lang="scss">
</style>
