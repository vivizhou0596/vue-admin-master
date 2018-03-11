import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import indexMag from './views/indexMag/index_manage'
import Main from './views/Main.vue'
import Classify from './views/product/Classify.vue'
import Merchant from './views/product/Merchant.vue'
import Shops from './views/product/shops.vue'
import Form from './views/product/form.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },{ 
        path: '/',
        component: Home,
        name: 'homeMag',//首页管理
        leaf: true,//只有一个节点
        children: [
            { path: '/indexMag', component: indexMag, name: 'homeMag' }
        ]
    },{
        path: '/main',
        redirect: '/',
        component: Home,
        name: 'productMag',//产品管理
        children: [
            { path: '/main', component: Main, name: 'mainPage', hidden: true },
            { path: '/classify', component:Classify , name: 'csfMag'},
            { path: '/merchant', component: Merchant, name: 'MctMag' },
            { path: '/shops', component: Shops, name: 'shops' },
            { path: '/user', component: Form, name: 'lists' },
        ]
    },
    {
        path: '/page4',
        redirect: '/',
        component: Home,
        name: 'orderMag',//订单管理
        children: [
            { path: '/page4', component: Page4, name: 'orderMag' },
        ]
    },
    {
        path: '/page6',
        redirect: '/',
        component: Home,
        name: 'userMag',//用户管理
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: 'userMag' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'sysMag',//系统管理
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;