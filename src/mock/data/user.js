import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    loginName: 'cd',
    password: 'dd',
    avatar: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
    name: '张某某'
  }
];

const Users = [];

for (let i = 0; i <6; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),//id
    name: Mock.Random.cname(),//一级目录
    icon:Mock.Random.image('20x20', '#894FC4', '#FFF', 'png', '!'),//ICON
    // subName:Mock.mock({
    //   "array|1-5": [{
    //       name:'@name',
    //       icon:"@image('20x20','#4A7BF7', '#FFF', 'png', '!')"
    //     }]
    // }),
    "subName|1-5":[{
      name:'@cname',
      icon:"@image('20x20','#4A7BF7', '#FFF', 'png', '!')"
    }],
    sort:Mock.mock('@increment()'),
    addr: Mock.mock('@county(true)'),
    'age|18-60': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1),
  }));
}

let Merchants =[]
for (let i = 0; i < 56; i++) {
  Merchants.push(Mock.mock({
    //id: Mock.Random.guid(),//商户id
    id: Mock.mock('@increment()'),//商户id
    name: Mock.Random.cname(),//商户名称
    //classfy:Mock.mock('@ctitle(3, 5)'),//分类
    "recordFiles|1-8":[{//备案信息
      name:'@name',
      src:"@image('20x20','#4A7BF7', '#FFF', 'png', '!')"
    }],
    concats:Mock.Random.cname(),//联系人名称
    //shopNum:Mock.mock({ "number|1-100": 10 }),//商铺数量
    "shopNum|1-10":10,//商铺数量
    addr: Mock.mock('@county(true)'),//地址
    tel:Mock.mock('@integer(10000000000,20000000000)'),//电话
    state:Mock.Random.integer(0, 1)//状态0停用，1正常
  }));
}



const Classifys = [];

for (let i = 0; i <6; i++) {
  Classifys.push(Mock.mock({
    id: Mock.Random.guid(),//商户id+商铺id
    name: Mock.Random.cname(),//一级目录
    icon:{
      name:'@name',
      src:Mock.Random.image('20x20', '#894FC4', '#FFF', 'png', '!')//ICON
    },
    "subName|1-5":[{//二级目录
      name:'@cname',
      files:{
        name:'@name',
        src:"@image('20x20','#4A7BF7', '#FFF', 'png', '!')"
      }
    }],
    sort:Mock.mock('@increment()')//排序
  }));
}


const Shops = [];

for (let i = 0; i <46; i++) {
  Shops.push(Mock.mock({
    id: Mock.Random.id(),//id
    name: Mock.Random.cname(),//商铺名
    type:Mock.Random.cname(),//商铺分类
    position:Mock.mock('@float(60, 100, 3, 5)'),//经纬度坐标位置
    shopAddr: Mock.mock('@county(true)'),//地址
    expireTime:Mock.mock('@date("yyyy-MM-dd")'),//到期时间
    shopState:Mock.Random.integer(0,3),//商铺状态0待租，1已租，2已售，3其他
    shopArea:Mock.Random.integer(5,300),//商铺面积
    maxHight:Mock.Random.integer(1,40),//总层高
    floor:Mock.Random.integer(1,40),//楼层
    structure:Mock.mock('@csentence(3, 5)'),//构造
    "waterEle|1-2": ["水","电","气"],
    eleType:Mock.Random.integer(0, 1),//电类型，0民用，1商用
    "rentType|1-5":[{
      time:Mock.Random.integer(3,24),//多少个月
      fee:Mock.Random.integer(1000,2400)//月租
    }],//租赁期
    remarks:Mock.mock('@cparagraph'),//其他
    "recordFiles|1-8":[{//商铺图片
      name:'@name',
      src:"@image('20x20','#4A7BF7', '#FFF', 'png', '!')"
    }],
    "qrCode":{//二维码
      name:'@name',
      src:"@image('20x20','#4A7BF7', '#FFF', 'png', '!')"
    }
  }));
}

var ClassfyOpt = []

for (let i = 0; i <3; i++) {
  ClassfyOpt.push(Mock.mock({
    value: Mock.Random.name(),
    label: Mock.Random.cname(),
    "children|1-5":[{
      value:'@name',
      label:'@cname'
    }]
  }));
}

export { LoginUsers, Users , Merchants, Classifys, Shops, ClassfyOpt};
