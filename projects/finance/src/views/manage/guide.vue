<template>
  <div class="app-wrapper">
    <heade></heade>
    <div class="main-container">
      <x-particles id="myParticles" class="particles-background" :config="config"></x-particles>
      <manage-mainw></manage-mainw>
    </div>
    <foote></foote>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { Heade,Foote,ManageMainw } from 'views/layout'
  import defConfig from '@/config/particles'

  export default {
    name: 'layout',
    components: {
      Heade,
      Foote,
      ManageMainw
    },
      data(){
        return{
            config:{}
        }

      },
    computed: {
      ...mapGetters([
        'name',
        'avatar'
      ])
    },
      created(){
          this.config = defConfig
      }
  }
</script>
<style>
  .particles-background {
    background: #f7fafc;
    height: 96%;
    width: 100%;
    position: absolute;
  }
</style>
