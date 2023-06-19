<template>
	<div class="navbar" mode="horizontal" style="width:100%; z-index: 1; background: #eff2f7;border-bottom: 1px solid #d7dde4;">
		<levelbar></levelbar>
		<tabs-view></tabs-view>
		<error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Levelbar from './Levelbar'
import TabsView from './TabsView'
// import Hamburger from 'components/Hamburger'
import Screenfull from 'components/Screenfull'
import ErrorLog from 'components/ErrLog'
import errLogStore from 'store/errLog'

export default {
  components: {
    Levelbar,
    TabsView,
    // Hamburger,
    ErrorLog,
    Screenfull
  },
  data() {
    return {
      log: errLogStore.state.errLog
    }
  },
  computed: {
    ...mapGetters([
      // 'sidebar',
      'name',
      'avatar'
    ])
  },
  methods: {
    // toggleSideBar() {
    //   this.$store.dispatch('ToggleSideBar')
    // },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.navbar {
			height: 50px;
			line-height: 50px;
			border-radius: 0px !important;
			/*.hamburger-container {*/
				/*float: left;*/
				/*padding: 0 5px;*/
				/*position: relative;*/
				/*height:5px;*/
			/*}*/
			.errLog-container {
				display: inline-block;
				position: absolute;
				right: 150px;
			}
	}
</style>



