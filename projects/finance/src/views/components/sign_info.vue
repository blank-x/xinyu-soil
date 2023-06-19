<template>
  <div>
    <el-dialog :title="dialogTitle" :visible.sync="detailPop.show" width="480px" :close-on-click-modal="false"
               custom-class="sign_info_dialogClass" >
      <word>
        <block>
          <row>
            <item>
              <span class="name">签署人姓名 : </span>
              <span class="value">{{signInfo.realName}}</span>
            </item>
          </row>
          <row>
            <item>
              <span class="name " style="vertical-align: top">签约开户行 : </span>
              <span class="value bankname">{{signInfo.bankBranch}}</span>
            </item>

          </row>
          <row>
            <item>
              <span class="name">银行账号 : </span>
              <span class="value">{{signInfo.bankAccount}}</span>
            </item>
          </row>
          <row>
            <item>
              <span class="name">证件类型 : </span>
              <span class="value">{{signInfo.idTypeDesc}}</span>
            </item>
          </row>
          <row>
            <item>
              <span class="name">证件号码 : </span>
              <span class="value">{{signInfo.idNo}}</span>
            </item>
          </row>


        </block>
      </word>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import word from '@/views/components/word/word'
  import block from '@/views/components/word/block'
  import item from '@/views/components/word/item'
  import row from '@/views/components/word/row'
  import {fetchSignDetail} from '@/api/settlement'

  export default {
    components: {word, block, item, row},
    data() {
      return {
        dialogTitle: '签署人信息',
        id: '',
        signInfo: {},
      }
    },
    computed: {},
    created() {

    },
    methods: {
      getSignDetail() {
        fetchSignDetail({id: this.id}).then(response => {
          if (response.data.items) {
            this.signInfo = response.data.items
          }

        })
      },

    },
    props: ['detailPop'],
    watch: {
      detailPop(val) {
        this.id = val.id;
        this.getSignDetail();
      }
    }
  }
</script>
<style scoped>

  .name {
    font-size: 14px;
    color: #000;
    font-weight: 500;
  }

  .value {
    font-size: 14px;
  }

  .remark {
    width: 700px;
    display: inline-block;
  }

  .bankname {
    width: 280px;
    display: inline-block;
    word-break: break-all;

  }

</style>
