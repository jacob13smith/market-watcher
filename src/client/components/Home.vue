<template>
	<div>
		<div class="home">
			<div class="home__inner">
				<div class="home__inner__title">Jacob's Security Tracker</div>
				<div class="home__inner__content">
					<keep-alive>
						<component :is="$store.state.activeTab"></component>
					</keep-alive>
				</div>
				<bittree-footer></bittree-footer>
			</div>
		</div>
	</div>
</template>
<script>
import Footer from './Footer.vue';

export default {
	components: {
		bittreeFooter: Footer
	}
}
</script>
<style lang="scss">
.home {
	display: flex;
	min-height: 100vh;

	&__inner {
		width: 100%;
		min-height: calc(100vh - 145px);

		> div {
			padding: 15px;
		}

		&__title {
			text-align: center;
			padding: 15px;
			font-size: 24px;
			color: #585858;
		}

		&__content {
			min-height: calc(100vh - 145px);
		}
	}
}
</style>
