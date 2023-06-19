import { getLastMonthYestdy, getCpInfo, convertDic, mergeDataConvert, deepClone, filterPayType } from '@/utils'
import { mapGetters } from 'vuex'
import {
    fetchList,
    update,
    inspectLog,
    getLockInfo
} from '@/api/auditCommon'

export default {
    data() {
        return {
            //分页查询参数
            listQuery: {
                query: {
                    bookId: undefined,
                    authorId: undefined,
                    cpId: null,
                    dealMonth: getLastMonthYestdy(),
                    type: undefined,
                    signStatusesKey: undefined,
                    payTypesKey: undefined,
                    editorIds: []
                }
            },
            //loading 获取列表状态
            listLoading: true,
            init: null,
            selectedItems: [],
            isLock: false,
            rejectProps: {},
            //查询月份限制
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },
            lockList:[],
            editorListAll:[],
            downloadParams:{}

        }
    }
    ,
    computed: {
        ...mapGetters([
            'dicList',
            'cpInfo',
            'auditCpsDetail'
        ]),
        ids() {
            let temp = []
            this.selectedItems.forEach(item => {
                temp.push(item.id)
            })
            return temp
        },
        cpList() {
            return this.auditCpsDetail || []
        },
        payTypesList() {
            let temp = []
            this.auditCpsDetail.forEach(item => {
                if (item.value === this.listQuery.query.cpId) {
                    temp = item.copyrightPayTypes.slice()
                }
            })
            temp.unshift({value: undefined, text: '全部'})
            return temp
        },
        typesList() {
            let temp = []
            this.auditCpsDetail.forEach(item => {
                if (item.value === this.listQuery.query.cpId) {
                    temp = item.payLogTypes.slice()
                }
            })

            temp.unshift({value: undefined, text: '全部'})
            temp = temp.filter(item => {
                return !item.partnerType
            })
            this.listQuery.query.types = undefined
            return temp
        },
        signStatusesList() {
            let temp = convertDic(this.dicList, '7').slice()
            temp.unshift({value: undefined, text: '全部'})
            return temp
        },
        editorList(){
            //cp为图书 默认穿全部
            let temp = []
            if (this.listQuery.query.cpId == 3) {
                this.listQuery.query.editorIds = []
            } else {
                temp = this.editorListAll.filter(item => {
                    return item.cpId == this.listQuery.query.cpId || item.cpId === null
                })
                if (temp.length === 1) {
                    this.listQuery.query.editorIds = [temp[0].userId]
                }
            }
            return temp
        }
    },
    //  获取列表
    methods: {

        // 重置表单数据
        resetForm(formName) {
            this.$nextTick(() => {
                if (this.$refs[formName] != undefined) {
                    this.$refs[formName].resetFields()
                }
            })
        },
        // 重置 搜索
        resetListQuery() {
            if (this.$refs['listQuery'] != undefined) {
                this.$refs['listQuery'].resetFields()
                this.listQuery.query.cpId = this.cpList[0].value
                this.fetchList()
            }
        },
        //  获取列表
        fetchList() {
            this.listLoading = true
            this.html = ''
            this.auditPassLoading = true
            let queryTemp = {
                bookId: this.listQuery.query.bookId,
                authorId: this.listQuery.query.authorId,
                cpId: this.listQuery.query.cpId,
                dealMonth: this.listQuery.query.dealMonth,
                types: this.listQuery.query.type !== undefined ? [this.listQuery.query.type] : undefined,
                signStatuses: this.listQuery.query.signStatusesKey !== undefined ? [this.listQuery.query.signStatusesKey] : undefined,
                payTypes: this.listQuery.query.payTypesKey !== undefined ? [this.listQuery.query.payTypesKey] : undefined,
                editorIds: this.listQuery.query.editorIds.length === 0 ? undefined : this.listQuery.query.editorIds
            }
            fetchList(queryTemp, this.paramsText.list).then(response => {
                // 路由 切换后，该回调函数继续执行会导致页面数据错误
                if (this.leaveCurrentRoute) {
                    return false
                }
                this.downloadParams = deepClone(queryTemp)
                this.setLockStatus()
                let condition = {
                    key: 'authorId',
                    authorId: {
                        column: 'authorId'
                    },
                    penName: {
                        column: 'authorId'
                    },
                    sumMoney: {
                        column: 'authorId',
                    },
                    bookId: {
                        column: 'bookId',
                    },
                    bookName: {
                        column: 'bookId',
                    },
                    cpName: {
                        column: 'bookId',
                    },

                    signStatusDesc: {
                        column: 'bookId',
                    },
                    payTypeDesc: {
                        column: 'bookId',
                    },
                    realName: {
                        column: 'bookId',
                    },
                    bookMoney: {
                        column: 'bookId',
                        isSum: true,
                        // 汇总哪个列表的数据
                        sumColumn: 'money'
                    }

                }
                this.listLen = response.data.items ? response.data.items.length : 0
                let routerPath = this.$route.path.split('/');

                this.$nextTick(() => {
                    document.querySelector('.auditTable tbody').innerHTML = mergeDataConvert({
                        data: response.data.items,
                        keys: condition,
                        isLock: this.isLock,
                        template: 'commonTable',
                        pageName: routerPath[routerPath.length - 1],
                        dealMonth: this.listQuery.query.dealMonth,
                        rejectAuthClass: this.rejectAuth ? '' : 'is-disabled',
                        deleteAuthClass: this.deleteAuth ? '' : 'is-disabled'
                    })
                    this.bindEvents()
                    this.tableHeaderTop = document.querySelector('.auditTableContainer').offsetTop
                })
                if (this.init === null) {
                    // 初始
                    this.init = true
                } else if (this.init = true) {
                    // 初始之后
                    this.init = false
                    this.getLockInfo()
                }
            })
        },
        // 查看驳回记录
        rejectAuditLog(id) {
            inspectLog(id).then(res => {
                this.rejectProps = {
                    list: res.data.items ? [res.data.items] : [],
                    dialogVisible: true
                }
            })
        },
        getLockInfo() {
            return getLockInfo().then(res => {
                if (res.data.items) {
                    this.lockList = res.data.items
                    this.setLockStatus()
                }

            })
        },
        setLockStatus(){
            this.lockList.forEach(item => {
                if (item.cpId === this.listQuery.query.cpId) {
                    this.isLock = item.locked
                }
            })
        },
        changeCp(){
            this.listQuery.query.editorIds = []
        }
    },
    created() {
        this.$store.dispatch('getAuditCpsDetail').then((data) => {
            this.listQuery.query.cpId = data[0].value
            this.$store.dispatch('getEditorList').then((data) => {
                this.editorListAll = data
            })
            this.getLockInfo().then(() => {
                this.fetchList()
            })
        })
    }
}

