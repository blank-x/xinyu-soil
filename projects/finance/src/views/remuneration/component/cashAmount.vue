<template>
    <div :style="styleBottom" ref="bottom"
         style="width:100%;background: #fff;z-index: 10;margin:0 -50px;padding-left: 32px;">
        <div style="height:50px;display: flex;align-items: center ">
            <div class="bottomItem"><span>稿费合计: </span><span class="num">{{bottomSumData.pay}}</span></div>
            <div class="bottomItem"><span>税金合计: </span><span class="num">{{bottomSumData.tax}}</span></div>
            <div class="bottomItem"><span>实付合计: </span><span class="num">{{bottomSumData.actualPay}}</span></div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                styleBottom: {}
            }
        },
        computed: {
            bottomSumData() {
                // 稿费合计
                let pay = 0;
                // 税金合计
                let tax = 0;
                //实付合计
                let actualPay = 0;

                this.selectedItems.forEach(item => {
                    pay += (+item.sumMoneyYuan)
                    tax += (+item.sumTaxMoneyYuan)
                    actualPay += (+item.sumPayMoneyYuan)
                })
                return {
                    pay: pay.toFixed(2),
                    tax: tax.toFixed(2),
                    actualPay: actualPay.toFixed(2)
                }
            }
        },
        methods: {

            resetPos() {

                this.styleBottom = {
                    marginTop: '-40px'
                }
                this.$nextTick(res=>{
                    const offsetTop = this.$refs.bottom.getBoundingClientRect().bottom
                    const winHeight = document.documentElement.clientHeight
                    if (offsetTop >= winHeight  ) {
                        this.styleBottom = {
                            position: 'fixed',
                            bottom: '2px',
                            marginTop: '0',
                            boxShadow: '0 -1px 5px rgba(0,0,0,.12)'
                        }
                    }
                })

            }
        },
        props: {
            selectedItems: {
                type: Array,
                default: []
            }
        },
        watch: {
            selectedItems(val) {
                this.$nextTick(() => {
                    this.resetPos()
                })
            }
        }
    }
</script>

<style scoped>
    .bottomItem {
        height: 50px;
        padding: 18px 0px 0 20px;
        min-width: 180px;
    }
    .bottomItem span{
        font-size: 14px;
    }
    .num{
        color:#FF8400
    }
</style>