import store from '@/store'
import { compareSimpleObject } from '@/utils'

let overflowStyle
let getTableHeight = function () {
    let filterDivList = ['filter-container', 'avatar-container', 'navbar', 'summaryBox']
    let filterHeight = 0
    filterDivList.forEach(function (item) {
        if (document.getElementsByClassName(item)[0]) {
            filterHeight += document.getElementsByClassName(item)[0].clientHeight
        }
    })
    store.dispatch('setMaxHeight', window.innerHeight - 120 - filterHeight)
    document.querySelector('body').style.overflow = overflowStyle
}

function getStyle (obj, sName) {
    return obj.currentStyle ? obj.currentStyle[sName] : getComputedStyle(obj, false)[sName]
}
let timer = null
let init = true

let resizeFn = function () {
    if (init) {
        document.querySelector('body').style.overflow = 'hidden'
        init = false
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
        init = true
        getTableHeight()
    }, 300)
}
export default {
    created() {
        overflowStyle = getStyle(document.querySelector('body'), 'overflow')
        window.removeEventListener('resize', resizeFn, false)
        window.addEventListener('resize', resizeFn, false)
        getTableHeight()
    },
    mounted(){
        getTableHeight()
    },
    computed: {
        tableHeight() {
            return this.$store.state.app.tableMaxHeight
        }
    },
    methods: {
    // 手动 重置
        resetTableHeight() {
            getTableHeight()
        },
        headerClick(column, ev, table) {
            table = table || 'listTable'
            let filterPanels = this.$refs[table].$refs.tableHeader.filterPanels
            for (let i in filterPanels) {
                if (i !== column.id) {
                    filterPanels[i].showPopper = false
                }
            }
        }
    },
    watch: {
        'listLoading': function (val, oldVal) {
            if (val) {
        //处理滚动条
                this.$nextTick(function () {
                    let tableDom = this.$parent.$el.getElementsByClassName('el-table__body-wrapper')[0]
                    if (tableDom) {
                        tableDom.scrollTop = 0
                        tableDom.scrollLeft = 0
                    }
                })
            } else {
        //选择表格过滤条件，未点击筛选 直接点击搜索 清空过滤条件
                if (this.$refs['listTable']) {
                    let currentColumn
                    for (var key in this.$refs['listTable'].$refs['tableHeader'].filterPanels) {
                        currentColumn = this.$refs['listTable'].$refs['tableHeader'].filterPanels[key]['column']
                        if (!compareSimpleObject(currentColumn.filteredValue, this.listQuery.query[currentColumn.columnKey]) && currentColumn.filterMultiple) {
                            this.$refs['listTable'].$refs['tableHeader'].filterPanels[key].filteredValue = this.listQuery.query[currentColumn.columnKey]
                        }
                    }
                }
            }
        }
    },
    setHeight(){
        'use strict'
        getTableHeight()
    }
}
