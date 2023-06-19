import Mock from 'mockjs'
import { param2Obj } from '@/utils'


export default {
    getNameList: config => {
        const nameList = []
        const count = 10
        for (let i = 0; i < count; i++) {
            nameList.push(Mock.mock({
                id: '@increment',
                name: '@cname'
            }))
        }
        console.log(nameList)
        return {
            total: nameList.length,
            items: nameList
        }
    },
    getParterDetailList:config =>{
        let  detailList = []
        const count = 100
        let obj = param2Obj(config.url);
        for(var i in obj){
            obj[i] = JSON.parse(obj[i]);
        }
        const page = obj.page.pageNo
        const limit = obj.page.pageSize
        const sort = obj.sort.orderDirect
        const category = obj.query.status
        console.log(page,limit)
        for (let i = 0; i < count; i++) {
            detailList.push(Mock.mock({
                "aliasName": "@cname",
                "bookName": "@cname",
                "bookUpdateTime": +Mock.Random.date('T'),
                "authorId|1-1000":1000,
                "bookId|1-1000":1000,
                'finish|1': [false,true],
                'logicalDel|1': [false,true],
                "cpId|1-1000":1000,
                "id|1-1000":1000,
                "partnerName": "@cname",
                "penName": "@cname"
            }))
        }
        if (sort === 'des') {
            detailList = detailList.reverse()
        }
        const pageList = detailList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

        console.log(pageList)

        return {
            total: pageList.length,
            items: pageList
        }
    }
}
