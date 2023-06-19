import $ from 'jquery'
export default {
    data() {
        return {
            html: '',
            listLen: null,
            tableContainWidth:'',
            checkBoxLen:0,
            alreadyBindEvent:false,
            auditPassLoading:false,
            tableHeaderTop:0,
            leaveCurrentRoute:false,
            rejectAjaxStatus:false  // 驳回ajax 状态标志
        }
    },
    computed: {},
    methods: {
        bindEvents() {
            if(this.alreadyBindEvent !== true){
                this.alreadyBindEvent = true
                document.addEventListener('click', this.clickHandler, false)
            }

            let  headerInput =  $('.auditTable')

            // 如果切换路由之后  之前的加载程序不会停止，但是dom已经不存在，出现报错，所以在这里加上判断
            if(headerInput.length>0){

                $('.auditTable .el-checkbox__input_header').prop('checked',true)
                this.alreadyBindEvent = true
                this.setSelectedOrSumMoney();
                this.getTheadWidth()
                this.listLoading = false
                this.auditPassLoading=false
            }
            window.addEventListener('scroll',this.isShowAffix ,false);
        },
        unBindEvents() {
            document.removeEventListener('click',this.clickHandler, false)
        },
        setSelectedOrSumMoney() {
            this.checkBoxLen = document.querySelectorAll('.auditTable tbody  .el-checkbox__input_td').length
            let selectDom = $(".auditTable tbody input[type='checkbox']:checked"), i = 0;
            let routerPath = this.$route.path.split("/");
            let temp = []
            while (selectDom[i]) {
                if(routerPath[routerPath.length -1] === 'waitCash' || routerPath[routerPath.length -1] === 'payFailed'){
                    // 兑现清单  支付失败列表
                    temp.push({id: selectDom[i].dataset["id"],sumMoneyYuan:selectDom[i].dataset["summoneyyuan"],sumTaxMoneyYuan:selectDom[i].dataset["sumtaxmoneyyuan"] ,sumPayMoneyYuan:selectDom[i].dataset["sumpaymoneyyuan"]});
                }else{
                    // 审核
                    temp.push({id: selectDom[i].dataset["id"], money: selectDom[i].dataset["money"]});
                }
                i++
            }
            this.selectedItems = temp
        },
        showDialog() {
           /* this.$notify({
                title: '提示',
                message: '功能未启用',
                type: 'warning'
            })*/
        },
        clickHandler(ev) {
            console.log('click')
            let self = this
            let target = ev.target


            if(typeof target.className ==='object'){
                // svg 标签 获取className 是一个对象
                return
            }
            if (target.className.indexOf('rejectAudit') >= 0) {
                self.rejectAudit(target.dataset['id'])
                return;
            }
            if (target.className.indexOf('rejectLog') >= 0) {
                self.rejectAuditLog(target.dataset['id'])
                return;
            }
            if (target.className.indexOf('authorLink') >= 0) {
                self.showDialog()
                return;
            }
            if (target.className.indexOf('deleteManual') >= 0) {
                self.deleteManual(target.dataset['id'])
                return;
            }
            if(target.className.indexOf('el-checkbox__input_box') >= 0) {
                $(".auditTable input[type='checkbox']").prop("checked", $(".el-checkbox__input_box").prop("checked"));
                this.setSelectedOrSumMoney();
            }
            if(target.className.indexOf('el-body__input_box') >= 0){

                $(".el-checkbox__input_box").prop("checked",$(".auditTable tbody  input[type='checkbox']").length == $(".auditTable tbody input[type='checkbox']:checked").length )
                this.setSelectedOrSumMoney();
            }
            /*if (target.className.indexOf('el-checkbox__input_td') >= 0) {
                let parentDom = target.parentNode,
                    headerSelectDom = document.querySelector('.el-checkbox__input_header')
                parentDom.className.indexOf('is-checked') >= 0 ? parentDom.classList.remove('is-checked') : parentDom.classList.add('is-checked')
                let selectedDom = document.querySelectorAll('tbody .el-checkbox__input.is-checked')
                if (selectedDom.length == this.checkBoxLen) {
                    headerSelectDom.parentNode.classList.add('is-checked')
                    headerSelectDom.parentNode.classList.remove('is-indeterminate')
                }
                else if (selectedDom.length == 0) {
                    headerSelectDom.parentNode.classList.remove('is-indeterminate')
                }
                else {
                    headerSelectDom.parentNode.classList.remove('is-checked')
                    headerSelectDom.parentNode.classList.add('is-indeterminate')
                }
                this.setSelectedOrSumMoney();
            }
            if (target.className.indexOf('el-checkbox__input_header') >= 0) {
                let parentDom = target.parentNode,
                    selectDom = document.querySelectorAll('tbody .el-checkbox__input');

                if (parentDom.className.indexOf('is-checked') >= 0) {
                    parentDom.classList.remove('is-checked');
                    parentDom.classList.remove('is-indeterminate');
                    let i = 0
                    while (selectDom[i]) {
                        selectDom[i].classList.remove('is-checked')
                        i++
                    }
                } else {
                    parentDom.classList.remove('is-indeterminate');
                    parentDom.classList.add('is-checked');
                    let i = 0
                    while (selectDom[i]) {
                        selectDom[i].classList.add('is-checked')
                        i++
                    }
                }

            }*/

        },
        getTheadWidth(){
            let theadWidth = document.querySelectorAll('.auditTable thead')[1].offsetWidth

            document.querySelector('.navbar').style.minWidth = theadWidth+20 +'px'
        },
        isShowAffix(){
            let sLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

            // 获取  container 到左边的距离
            let leftContainer = parseInt($('.auditTableContainer').offset().left)
            if(document.querySelector('.ant-affix')){
                document.querySelector('.ant-affix').style.setProperty('left',leftContainer - sLeft+'px','important');
            }

        },


    },
    watch: {
        'listQuery.query.bookId': {
            handler: function (val, oldVal) {
                if (val === null || val === undefined) return
                let val1 = val.replace(/[^0-9]/g, '')

                this.$nextTick(() => {
                    this.listQuery.query.bookId = val1
                })

            }
        },
        'listQuery.query.authorId': {
            handler: function (val, oldVal) {
                if (val === null || val === undefined) return
                let val1 = val.replace(/[^0-9]/g, '')
                this.$nextTick(() => {
                    this.listQuery.query.authorId = val1
                })
            }
        }
    },
    beforeRouteLeave(to,from,next){
        this.leaveCurrentRoute = true
        if(document.querySelector('.auditTable tbody')){
            document.querySelector('.auditTable tbody').innerHTML = ''
        }
        next()
    },
    beforeDestroy(){
        this.unBindEvents()
        document.documentElement.scrollLeft = 0
    }
}
