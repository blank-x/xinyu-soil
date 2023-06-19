<template>
    <div class="app-container">
        <!--标题-->
        <contentTitle :titleParams="{title: '《'+bookName+'》全勤奖明细'}" style="border:none;"></contentTitle>
        <!--列表-->
        <el-table :data="list"
                  ref="listTable"
                  size="small"
                  :max-height="tableHeight"
                  :empty-text="emptyText"

                  v-loading="listLoading"
                  element-loading-text="加载中.."
                  border fit stripe highlight-current-row
                  :header-cell-style="appConfig.HEADER_STYLE"
                   >
            <el-table-column label="月份" align="center" prop="dealMonth">
                <template slot-scope="scope">
                    <span>   {{scope.row.dealMonth.toString() | MonthsFilter}}{{scope.row.finish ? '(完结)':''}}</span>
                </template>

            </el-table-column>
            <el-table-column label="本月收入" align="center" prop="monthMoneyYuan">
                <!--<template slot-scope="scope">-->
                    <!--<nullValue :text="scope.row.createTime"></nullValue>-->
                <!--</template>-->
            </el-table-column>

            <el-table-column label="本月应付" align="center" prop="monthMoneyPayYuan">

            </el-table-column>
            <el-table-column label="月末结余" align="center" prop="monthMoneyLeftYuan">

            </el-table-column>
            <el-table-column label="全勤级别" align="center" prop="rewardGradeDesc">

            </el-table-column>
            <el-table-column label="操作" align="center" width="90" fixed="right">
                <template slot-scope="scope">
                    <router-link target="_blank" :to="'/remuneration/fulltteAndanceMonth/'+listQuery.query.bookId+'/'+scope.row.dealMonth+'/info'">
                        <el-button type="text" class="button-link">查看明细</el-button>
                    </router-link>
                </template>
            </el-table-column>
        </el-table>


    </div>
</template>

<script>
    import {fullAttentance, permission} from '@/api/fullAttentance'//接口
    import {mapGetters} from 'vuex'
    import tableMixin from '@/mixins/tableHeight'

    import {convertDic, getCpInfo, deepClone, getLastMonthYestdy} from '@/utils'

    export default {
        mixins: [tableMixin],
        components: {},
        data() {
            return {
                permission: permission,//权限
                emptyText: '',//无数据提示
                init: true,
                headerStyle: this.appConfig.HEADER_STYLE,//表头样式
                title: undefined,
                listLoading: true,//懒加载
                list: [],//内容列表数据
                totalMoney: undefined,
                totalMoneyYuan: undefined,
                totalItems: 0,
                bookName:'',
                listQuery: {
                    query: {
                        bookId: this.$route.params.id,
                    }
                },//列表传入参数

            }
        },
        created() {
            console.log(this.$route)
            this.getList()
        },
        computed: {
            //      字典调用方法
            ...mapGetters([
                'cpInfo',
                'dicList'
            ]),
        },
        methods: {
            //列表数据-接口
            getList() {
                this.listLoading = true
                fullAttentance(this.listQuery.query).then(response => {
                    this.listLoading = false
                    if (response.data.items) {
                        this.list = response.data.items.monthPay4RewardVOs
                        this.bookName =  response.data.items.bookName
                    }

                    if (this.init) {
                        this.emptyText = '暂无数据'
                        this.init = false
                    } else {
                        this.emptyText = '查询无结果'
                    }
                })
            },

        },


    }
</script>
<style lang="scss" scoped>

</style>
