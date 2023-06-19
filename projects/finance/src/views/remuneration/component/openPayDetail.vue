<template>
    <div>
        <div>{{detailData.typeDesc}} </div>
        <router-link target="_blank" :to="link" v-if="[3,9,35,36].indexOf(this.detailData.type) >-1">
            <el-button type="text" class="button-link" v-if="detailData.manual!==true">查看明细</el-button>
        </router-link>
        <a type="text" class="el-button--text" target="_blank" :href="subscribeLink" v-if="this.detailData.type === 1 && detailData.manual!==true">查看明细</a>
    </div>

</template>

<script>
    export default {
        name: "openPayDetail",
        computed: {
            link() {
                // 全勤
                if (  [3,35,36].indexOf(this.detailData.type)>-1) {
                    return {
                        path: '/remuneration/fulltteAndance/' + this.detailData.bookId,
                    }
                }
                // 打赏分成
                if (this.detailData.type === 9) {
                    return {
                        path: '/remuneration/rewardMonthDetail/' + this.detailData.bookId+'/'+this.detailData.dealMonth
                    }
                }

            },
            subscribeLink() {
                // 订阅分成  跳转到旧站
                return process.env.PAGE_CONFIG.WEBSITE_URL + '/analytics/detail/book/' + this.detailData.bookId;
            }
        },

        props: {
            detailData: {
                type: Object,
                default: []
            },

        }

    }
</script>

<style scoped>
    .button-link {
        padding-top: 2px;
        padding-bottom: 2px;
    }
</style>
