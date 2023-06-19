import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
    List.push(Mock.mock(

        {
            "applyId|1-1000":1000,
            "authorId|1-1000":1000,
            "bookId|1-1000":1000,
            "copyrightId|1-1000":1000,
            "cpId|1-1000":1000,
            'cpName|1': ['磨铁','墨墨','逸云','锦文','醉唐-男','醉唐-女','图书'],
            "createTime": +Mock.Random.date('T'),
            "editorId|1-1000":1000,
            "editorName": "@cname",
            "id|1-1000":1000,
            "inspectName": "@cname",
            "operatorId|1-1000":1000,
            "operatorName": "@cname",
            "payType": "@cname",
            "payTypeName": "@cname",
            "penName": "@cname",
            "remark": "@cname",
            'reward|1': [false,true],
            "rewardId|1-1000":1000
        }))
}

export default {
    getList: config => {
        let obj = param2Obj(config.url);
        for(var i in obj){
            obj[i] = JSON.parse(obj[i]);
        }

    // const { bookId, authorId, cpId,page = 1, limit = 20} =obj;
        const page = obj.page.pageNo
        const limit = obj.page.pageSize
        const sort = obj.sort.orderDirect
        const category = obj.query.status

        let reflect ={
            '1':'全部',
            '2':'磨铁',
            '3':'墨墨',
            '4':'逸云',
            '5':'醉唐-男',
            '6':'醉唐-女',
            '7':'图书'
        };
        console.log(category)
        console.log(page)
        console.log(limit)
        console.log(sort)
        let randomNum = parseInt(Math.random()*5 +2);
        let mockList = List.filter((item,index,arr) => {
      // if (importance && item.importance !== +importance) return false
      // if (type && item.type !== type) return false
      // if (title && item.title.indexOf(title) < 0) return false
            if(reflect[category] !=='全部' && reflect[category]!=item.cpName ) return false;
            if(index % randomNum == 0){
                return false
            }
            return true
        });

        if (sort === 'des') {
            mockList = mockList.reverse()
        }

        const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
        return {
            total: mockList.length,
            items: pageList
        }
    },
    getPv: () => ({
        pvData: [{ key: 'PC网站', pv: 1024 }, { key: 'mobile网站', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]
    }),
    getArticle: () => ({
        id: 120000000001,
        author: { key: 'mockPan' },
        source_name: '原创作者',
        category_item: [{ key: 'global', name: '全球' }],
        comment_disabled: false,
        content: '<p>我是测试数据我是测试数据</p><p><img class="wscnph" src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943" data-wscntype="image" data-wscnh="300" data-wscnw="400" data-mce-src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>"',
        content_short: '我是测试数据',
        display_time: +new Date(),
        image_uri: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
        platforms: ['a-platform'],
        source_uri: 'https://github.com/PanJiaChen/vue-element-admin',
        status: 'published',
        tags: [],
        title: ''
    })
}
