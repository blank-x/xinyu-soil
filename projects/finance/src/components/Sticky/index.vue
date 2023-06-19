<template>
  <div :style="{height:height+'px',zIndex:zIndex}" :class="{'active':active}">
    <div :class="className" :style="{bottom:bottom+'px',zIndex:zIndex,position:position,width:width,height:height+'px'}">
      <slot>
        <div>sticky</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sticky',
  props: {
    stickyTop: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: Number,
      default: 2
    },
    className: {
      type: String
    }
  },
  data() {
    return {
      active: false,
      position: '',
      currentTop: '',
      width:'100%',
      height: undefined,
      child: null,
      stickyHeight: 0,
      bottom:null,

    }
  },
  methods: {
    sticky() {
      if (this.active) {
        return
      }
      this.position = 'fixed'
      this.active = true
      this.width = this.width + 'px'
      this.bottom = 0
    },
    reset() {
      if (!this.active) {
        return
      }
      this.position = ''
      //this.width = '0'
      this.active = false
    },
    handleScroll() {
      this.width = this.$el.getBoundingClientRect().width
      const offsetTop = this.$el.getBoundingClientRect().top
      if (offsetTop >= this.stickyTop) {
        this.sticky()
        return
      }
      this.reset()
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
