export default {
    methods:{
        // 手动 重置
        headerClick(column,ev,table){
            table = table || 'listTable'
            let filterPanels = this.$refs[table].$refs.tableHeader.filterPanels
            for(let i in filterPanels){
                if(i !== column.id){
                    filterPanels[i].showPopper = false
                }
            }
        }
    }

}