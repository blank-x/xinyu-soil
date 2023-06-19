<template>
  <div class="dashboard-container">
      <div class="default-image">
        <img src="~assets/index-default.png" alt="">
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import adminDashboard from './admin/index'
// import editorDashboard from './editor/index'

export default {
  name: 'dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      // currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles',
    ])
  },
  created() {
    if (this.roles.indexOf('admin') >= 0) {
      return
    }
    // this.currentRole = 'editorDashboard'
    //获取应用公共数据

  }
}
</script>
<style scoped>
  .default-image{
    margin:180px auto;
    text-align: center;
  }
</style>