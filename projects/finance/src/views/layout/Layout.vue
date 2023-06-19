<template>
    <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
        <heade></heade>
        <hamburger :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <sidebar class="sidebar-container"></sidebar>
        <div class="main-container">
            <navbar v-show="isMainPage"></navbar>
            <app-main></app-main>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {Navbar, Sidebar, AppMain, Heade} from 'views/layout'
    import Hamburger from 'components/Hamburger'

    export default {
        name: 'layout',
        components: {
            Navbar,
            Sidebar,
            AppMain,
            Heade,
            Hamburger
        },
        computed: {
            ...mapGetters([
                'name',
                'avatar'
            ]),
            sidebar() {
                if(!this.$store.state.app.sidebar.opened){
                    let doms =  document.querySelectorAll('.is-opened .el-menu')
                    for(let i  = 0; i<doms.length;i++){
                        doms[i].style.display='none'
                    }
                }
                return this.$store.state.app.sidebar
            },
            isMainPage(){
                let match = this.$route.matched[0] && (this.$route.matched[0].path !== '' &&this.$route.matched[0].path !== '/' && this.$route.matched[0].path !== '/dashboard')
                return match
            }
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('ToggleSideBar')
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";

    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
        &.hideSidebar {
            .sidebar-container {
                width: 56px !important;
                overflow: inherit;
                padding: 0 10px;
            }
            .main-container {
                margin-left: 56px;
            }
        }
        .sidebar-container {
            top: 60px;
        }
        .sidebar-container {
            /*transition: width .2s linear !important;*/
            width: 155px !important;
            border-right: 1px solid #d7dde4;
            padding: 0 10px;
            height: 100%;
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 1001;
            overflow-y: auto;
            &::-webkit-scrollbar {
                display: none
            }
        }
        .main-container {
            min-height: 100%;
            /*transition: margin-left 0.2s linear !important;*/
            margin-left: 155px;
            padding-top: 60px;
        }
    }

</style>
