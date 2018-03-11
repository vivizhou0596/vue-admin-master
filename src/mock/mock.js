import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers, Users ,Merchants,Classifys,Shops,ClassfyOpt } from './data/user';
let _Users = Users;
let _Merchants = Merchants
let _Classifys = Classifys
let _Shops = Shops
let _ClassfyOpt = ClassfyOpt

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //登录
    mock.onPost('/login/index').reply(config => {
      let {loginName, password} = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.loginName === loginName && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 200, msg: '请求成功', user }]);
          } else {
            resolve([200, { code: 500, msg: '账号或密码错误' }]);
          }
        }, 1000);
      });
    });
    //获取商铺全部分类
    mock.onGet('/shops/classfyOpt').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            success:true,
            msg:null,
            rows:_ClassfyOpt,
            message:null
          }]);
        }, 1000);
      });
    });
    //获取商铺分页
     mock.onGet('/shops/query').reply(config => {
      //console.log(config.params)
      let {page,name,date,rows} = config.params;
      //console.log(_Shops)
      let mockShops = _Shops.filter(shop => {
        if (name && shop.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockShops.length;
      mockShops = mockShops.filter((u, index) => index < rows * page && index >= rows * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            success:true,
            msg:'查找成功',
            total:total,
            rows:mockShops,
            message:null
          }]);
        }, 1000);
      });
    });

    //获取商户信息(分页)
    mock.onGet('/merchant/listpage').reply(config => {
      let {page,name} = config.params;
      let mockMerchants = _Merchants.filter(merchant => {
        if (name && merchant.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockMerchants.length;
      mockMerchants = mockMerchants.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            success:true,
            msg:null,
            total:total,
            rows:mockMerchants,
            message:null
          }]);
        }, 1000);
      });
    });
    //修改用户状态
    mock.onGet('/merchant/changeState').reply(config => {
      let { id ,state} = config.params;
      _Merchants = _Merchants.map(u=>{
        if(u.id == id){
          u.state = u.state=='1'?'0':'1'
        }
        return u
      })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            success:true,
            msg:'修改成功',
            rows:null,
            message:'修改成功'
          }]);
        }, 500);
      });
    });
   
    //新增商户
     mock.onGet('/merchant/add').reply(config => {
      //console.log(config.params)
      let { name, addr, concats, recordFiles, shopNum,tel,state } = config.params;
      _Merchants.push({
        name: name,
        addr: addr,
        concats: concats,
        recordFiles: recordFiles,
        shopNum: shopNum,
        tel:tel,
        state:state
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
                    success:true,
                    msg:'新增成功',
                    rows:null,
                    message:'新增成功'
                  }]);
        }, 500);
      });
    });
     //编辑商户
     mock.onGet('/merchant/edit').reply(config => {
      //console.log(config.params)
      let { id, name, addr, concats, recordFiles, shopNum,tel,state} = config.params;
      _Merchants.some(m => {
        if (m.id === id) {
          m.name = name;
          m.addr = addr;
          m.concats = concats;
          m.recordFiles = recordFiles;
          m.shopNum = shopNum;
          m.tel = tel;
          m.state = state;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            success:true,
            msg:'修改成功',
            rows:null,
            message:'修改成功'
          }]);
        }, 500);
      });
    });
    //获取分类信息
    mock.onGet('/classify/list').reply(config => {
      let {name} = config.params;
      //console.log(Classifys)
      let mockClassifys = _Classifys.filter(classify => {
        if (name && classify.name.indexOf(name) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            success:true,
            msg:null,
            rows:mockClassifys,
            message:null
          }]);
        }, 1000);
      });
    });
    //新增分类
    mock.onGet('/classify/add').reply(config => {
      //console.log(config.params)
      let { name, icon, subName } = config.params;
      _Classifys.push({
        name: name,
        icon: icon,
        subName: subName
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
              success:true,
              msg:'新增成功',
              rows:null,
              message:'新增成功'
          }]);
        }, 500);
      });
    });
    //编辑分类
    mock.onGet('/classify/edit').reply(config => {
      console.log(config.params)
      let { id, name, icon, subName,sort } = config.params;
      _Classifys.some(c => {
        if (c.id === id) {
          c.name = name;
          c.icon = icon;
          c.subName = subName;
          c.sort = sort;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
              success:true,
              msg:'修改成功',
              rows:null,
              message:'修改成功'
          }]);
        }, 500);
      });
    });
    //删除分类
    mock.onGet('/classify/del').reply(config => {
      let { id } = config.params;
      _Classifys = _Classifys.filter(c => c.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            success:true,
            msg:'删除成功',
            rows:null,
            message:'删除成功'
          }]);
        }, 500);
      });
    });
    //获取二维码
    mock.onPost('/getCodeUrl').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            success:true,
            msg:null,
            rows:'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
            message:null
          }]);
        }, 1000);
      });
    });

  }
};