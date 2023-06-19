import {mapGetters} from 'vuex'
import {getLastMonthYestdy, convertDic, mergeDataConvert,getCpInfo,deepClone} from '@/utils'
import {fetchList,update,pass,getCompanyLockInfo} from '@/api/auditCommon'

export default {
    created() {
        this.$store.dispatch('getAuditCompanyDetail').then((data)=>{
            this.listQuery.query.companyId = data[0].value
            this.defaultCompanyId = data[0].value;
            this.getCompanyLockInfo().then(()=>{
                this.fetchList()
            })
        })
    },

    data(){
        return {
          //分页查询参数
            listQuery: {
                query: {
                    bookId: undefined,
                    authorId: undefined,
                    companyId: null,
                    cpId: null,
                    dealMonth: getLastMonthYestdy(),
                    payTypesKey: undefined,
                    signStatusesKey: undefined,
                    type: undefined
                }
            },
          //列表数据
            list: [],
          //loading 状态
            listLoading: true,

            init: null,
            selectedItems:[],
            isLock:false,
          //查询月份限制
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            lockList:[]
        }
    },
    computed: {
        ...mapGetters([
            'dicList',
            'cpInfo',
            'auditCompanyDetail'
        ]),
        companyList() {
            this.listQuery.query.companyId =this.auditCompanyDetail[0] && this.auditCompanyDetail[0].value
            return this.auditCompanyDetail || []
        },
        cpList() {
            let temp = []
            this.auditCompanyDetail.forEach(item=>{
                if(item.value === this.listQuery.query.companyId){
                    temp = item.cpInfos.slice()
                }
            })
            if(temp.length >1){
                temp.unshift({value:undefined,text:'全部'})
            }
            this.listQuery.query.cpId = temp[0] && temp[0].value
            return temp || []
        },
        payTypesList(){
            let temp = []
            this.auditCompanyDetail.forEach(item=>{
                if(item.value === this.listQuery.query.companyId){
                    temp = item.copyrightPayTypes.slice()
                }
            })
            temp.unshift({value:undefined,text:'全部'})
            return temp
        },
        // 稿费类型
        typesList(){
            let temp = []
            this.auditCompanyDetail.forEach(item=>{
                if(item.value === this.listQuery.query.companyId){
                    temp = item.payLogTypes
                }
            })
            temp = temp.filter(item=>{
                return item.partnerType
            })
            temp.unshift({value:undefined,text:'全部'})
            return temp
        },
        signStatusesList(){
            let temp = convertDic(this.dicList, '7').slice()
            temp.unshift({value:undefined,text:'全部'})
            return temp
        },
        ids(){
            let temp = []
            this.selectedItems.forEach( item=> {
                temp.push(item.id)
            })
            return temp
        }
    },
    methods: {
        // 重置表单数据
        resetListQuery() {
            if (this.$refs['listQuery'] != undefined) {
                this.$refs['listQuery'].resetFields();
                this.listQuery.query.companyId = this.defaultCompanyId;
                this.fetchList()
            }
        },
        // 根据公司 获取是否锁定
        getCompanyLockInfo(){
            return getCompanyLockInfo().then(res=>{
                if(res.data.items){
                    this.lockList = res.data.items
                    this.setLockStatus()
                }
            })
        },
        // 获取列表
        fetchList() {
            this.listLoading = true;
            this.html = ''
            this.auditPassLoading = true
            //  如果是全部 置换为undefined  不传输到后台
            let queryTemp = {
                bookId: this.listQuery.query.bookId,
                authorId: this.listQuery.query.authorId,
                cpId: this.listQuery.query.cpId,
                companyId:this.listQuery.query.companyId,
                dealMonth: this.listQuery.query.dealMonth,
                types: this.listQuery.query.type !== undefined ? [this.listQuery.query.type] : undefined,
                signStatuses:this.listQuery.query.signStatusesKey !== undefined ? [this.listQuery.query.signStatusesKey] : undefined,
                payTypes:this.listQuery.query.payTypesKey !== undefined ? [this.listQuery.query.payTypesKey] : undefined
            }
            fetchList(queryTemp, this.paramsText.list).then(response => {
                // 路由 切换后，该回调函数继续执行会导致页面数据错误
                if(this.leaveCurrentRoute){
                    return false
                }
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
                    bookId:{
                        column: 'bookId',
                    },
                    bookName:{
                        column: 'bookId',
                    },
                    cpName:{
                        column: 'bookId',
                    },
                    signStatusDesc:{
                        column: 'bookId',
                    },
                    payTypeDesc:{
                        column: 'bookId',
                    },
                    realName:{
                        column: 'bookId',
                    },
                    bookMoney: {
                        column: 'bookId',
                        isSum: true,
                        // 汇总哪个列表的数据
                        sumColumn: 'money'
                    }
                }

                if(this.init=== null){
                    this.init = true
                }else if(this.init === true){
                    this.init=false
                    this.getCompanyLockInfo()
                }

                let routerPath = this.$route.path.split("/");
                this.setLockStatus()
                this.listLen = response.data.items ? response.data.items.length : 0

                // this.html = mergeDataConvert({
                //     data:response.data.items,
                //     keys:condition,
                //     isLock:this.isLock,
                //     template:'commonTable',
                //     pageName:routerPath[routerPath.length -1],
                //     dealMonth:this.listQuery.query.dealMonth,
                //     rejectAuthClass:this.rejectAuth?'':'is-disabled'
                // })


                this.$nextTick(()=>{
                    document.querySelector('.auditTable tbody').innerHTML =mergeDataConvert({
                        data:response.data.items,
                        keys:condition,
                        isLock:this.isLock,
                        template:'commonTable',
                        pageName:routerPath[routerPath.length -1],
                        dealMonth:this.listQuery.query.dealMonth,
                        rejectAuthClass:this.rejectAuth?'':'is-disabled'
                    })
                    this.bindEvents()
                    this.tableHeaderTop = document.querySelector(".auditTableContainer").offsetTop;
                })
            });
        },

        // 不予支付  驳回一审
        rejectAudit(id){
            // 没有权限
            if(this.rejectAuth === false){
                return;
            }
            if(this.rejectAjaxStatus === true){
                return
            }
            this.rejectAjaxStatus = true
            update(id,this.paramsText.reject,{}).then(response=>{
                if(response.data.items){
                    let checkboxDom =  document.querySelector("#spanCheckbox_"+id),
                        handleDom =  document.querySelector("#handle_"+id);
                    checkboxDom.parentNode.removeChild(checkboxDom);
                    handleDom.innerHTML = "已驳回";
                    this.setSelectedOrSumMoney();
                    this.rejectAjaxStatus = false
                    this.$message({
                        message: this.paramsText.rejectMsg,
                        type: 'success',
                        duration: 2000,
                        onClose:()=>{

                        }
                    });
                }else{
                    this.$message({
                        type: 'warning',
                        message: response.data.msg,
                    });
                    this.rejectAjaxStatus = false
                }
            })
        },
        setLockStatus(){
            this.lockList.forEach(item=>{
                if(item.companyId === this.listQuery.query.companyId){
                    this.isLock = item.locked
                }
            });
        }
    }
}