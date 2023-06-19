<template>
    <div v-show="!listLoading && total " class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.page.pageNo"
                       :page-sizes="appConfig.PAGE_SIZE" :page-size="pagination.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>
<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  export default {
    name: "pagination",
    methods: {
      getList(){
        this.$emit('getList');
      },
      handleSizeChange(val) {
        //TODO 全局设置每页条数
        this.$store.dispatch('setPageSize', val);
        this.appConfig.DEFAULT_PAGE_SIZE = val
        this.listQuery.page.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page.pageNo = val;
        this.getList();
      }
    },
    computed: {
      ...mapGetters([
        'pagination',
      ])
    },
    props: ['listLoading', 'listQuery', 'total']
  }
</script>
