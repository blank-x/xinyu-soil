import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const List1 = []
const count = 100

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        id: '@increment',
        'fromNowOn|+1': 1,
        'now|+1':'@now("yyyy-MM-dd")',
        'timestamp|+1': function(){
            let now= new Date(this.now);
            now.setTime(now.getTime()-this.fromNowOn*24*60*60*1000);
            let sub=now;
            var year = sub.getFullYear()<10?'0'+sub.getFullYear():sub.getFullYear();
            var month = sub.getMonth() + 1<10?'0'+sub.getMonth():sub.getMonth();
            var day = sub.getDate()<10?'0'+sub.getDate():sub.getDate();
            return year+'-'+month;
        },
        'cp|1': ['磨铁', '默默', '锦文','醉唐'],
        title: '@ctitle(10, 11)',
        'ranking|1': ['打赏月榜', '新书月榜', '陌陌古言新书月榜','醉唐新书月榜'],
        bookId:'@integer(1000, 10000)',
        'type|1': ['CN', 'US', 'JP', 'EU'],
        bookName:'@csentence(10)',
        bdName:'@csentence(8)',
        'cpId|1-10': 10,
        'status|1': ['published', 'draft', 'deleted'],
        'numSize|1-100': 80,
    }))
    List1.push(Mock.mock({
        id: '@increment',
        'now|+1':'@now("yyyy-MM-dd")',
        'fromNowOn|+1': 1,
        'timestamp|+1': function(){
            let now= new Date(this.now);
            now.setTime(now.getTime()-this.fromNowOn*24*60*60*1000);
            let sub=now;
            var year = sub.getFullYear()<10?'0'+sub.getFullYear():sub.getFullYear();
            var month = sub.getMonth() + 1<10?'0'+(sub.getMonth()+1):sub.getMonth();
            var day = sub.getDate()<10?'0'+sub.getDate():sub.getDate();
            return year+'-'+month;
        },
        'compay|1': ['磨铁', '默默', '锦文','醉唐','秀闻','华文印象','图书'],
        remarks:'@cparagraph(2)',
        'freeTotal|1-1100.1-2':1,
        'taxTotal|1-1200.1-2':1,
        'actualTotal|1-1300.1-2':1,
        'name':'@cname',
    }))
}

export default {
    getMothRankList: config => {
        const {month, page = 1, limit = 20, sort } = param2Obj(config.url)
        let mockList = List.filter(item => {
            if (month && item.timestamp.indexOf(month) < 0) return false
            return true
        })

        if (sort === '-id') {
            mockList = mockList.reverse()
        }

        const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

        return {
            total: mockList.length,
            items: pageList,
            status:200
        }
    },
    getFeePayMentlist:config => {
        const {compay, page = 1, limit = 20, sort } = param2Obj(config.url)
        let mockList = List1.filter(item => {
      //if (compay && item.compay.indexOf(compay) < 0) return false
            return true
        })

        if (sort === '-id') {
            mockList = mockList.reverse()
        }

        const pageList = mockList.filter((item, index) => index < limit)

        return {
            total: mockList.length,
            items: pageList,
            status:200
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
