import { param2Obj } from '@/utils'

const userMap = {
    admin: {
        role: ['admin'],
        token: 'admin',
        introduction: '我是超级管理员',
        avatar: 'http://motie-web-static-resource.oss-cn-qingdao.aliyuncs.com/people/default.jpg',
        name: 'Super Admin'
    },
    editor: {
        role: ['editor'],
        token: 'editor',
        introduction: '我是编辑',
        avatar: 'http://motie-web-static-resource.oss-cn-qingdao.aliyuncs.com/people/2110/21102019/1.jpg',
        name: 'Normal Editor'
    },
    developer: {
        role: ['develop'],
        token: 'develop',
        introduction: '我是开发',
        avatar: 'http://motie-web-static-resource.oss-cn-qingdao.aliyuncs.com/people/2110/21102019/1.jpg',
        name: '工程师小王'
    },
    'zhangsan': {
        role: ['admin'],
        token: 'admin',
        introduction: '我是磨铁管理员',
        avatar: 'http://motie-web-static-resource.oss-cn-qingdao.aliyuncs.com/people/2110/21102019/1.jpg',
        name: '工程师小王'
    }
}

export default {
    loginByUsername: config => {
        const { username } = JSON.parse(config.body)
        return userMap[username]
    },
    getUserInfo: config => {
        const { token } = param2Obj(config.url)
        if (userMap[token]) {
            return userMap[token]
        } else {
            return Promise.reject('error')
        }
    },
    logout: () => { return {status:200,success:true}}
}
