<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<i class="el-icon-arrow-left"
			   style="float:left;font-size:28px;margin-top:5px;color:#888;"
			   @click = "goBack"
			   ></i>
			<el-form :inline="true" :model="filters" style="margin-left:50px">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="商铺名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.date" placeholder="到期时间">
				    <el-option
				      v-for="item in dateOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getMerchants">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="shops"  highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="id" label="商铺ID" width="140" >
			</el-table-column>
			<el-table-column prop="name" label="商铺名称" width="120" >
			</el-table-column>
			<el-table-column prop="type" label="分类" width="100" >
			</el-table-column>
			<el-table-column prop="position" label="位置" min-width="120" >
			</el-table-column>
			<el-table-column prop="shopAddr" label="地址" min-width="120" >
			</el-table-column>
			<el-table-column prop="expireTime" label="到期时间" width="120" sortable>
			</el-table-column>
			<el-table-column prop="shopState" label="状态" width="120"  :formatter="formatState">
			</el-table-column>
			<el-table-column label="操作" width="180">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<!-- <el-button size="small" type="info" @click="handleDetial(scope.$index, scope.row)">商铺信息</el-button> -->
					<el-button type="warning" size="small" @click="handleState(scope.$index, scope.row)">
						{{(scope.row.state =='1'&&'停用')||'启用'}}
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="商户名称" >
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="商铺数量">
					<el-input-number v-model="editForm.shopNum" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="联系人" >
					<el-input v-model="editForm.concats" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" >
					<el-input v-model="editForm.tel" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="editForm.state">
						<el-radio class="radio" :label="1">正常</el-radio>
						<el-radio class="radio" :label="0">停用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div>
				<label style="display:block;margin:10px 0;">备案信息：</label>
				<up-loader :imgFiles="editForm.recordFiles" @fileChanged="getEidtFileChanged($event)" :finished="addfinish"></up-loader>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="商户名称" >
					<el-input v-model="addForm.name" auto-complete="off" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item label="商铺位置">
					<el-input v-model="addForm.name" auto-complete="off" style="width:400px"></el-input>
				</el-form-item>
				<el-form-item label="商铺分类">
					<el-cascader
					    expand-trigger="hover"
					    :options="classfyOpt"
					    v-model="selClassfyOpt"
					    @change="handleClassfyOptChange">
					</el-cascader>
				</el-form-item>
				<el-form-item label="商铺坐标" >
					<el-input v-model="addForm.position" auto-complete="off" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item label="商铺面积" >
					<el-input v-model="addForm.shopArea" auto-complete="off" style="width:200px"></el-input>
					<span>平方米</span>
				</el-form-item>
				<el-form-item label="层高" >
					<el-input v-model="addForm.maxHight" auto-complete="off" style="width:200px"></el-input>
					<span>米</span>
				</el-form-item>
				<el-form-item label="到期时间" >
					<el-date-picker
				      v-model="addForm.expireTime"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
				</el-form-item>
				<el-form-item label="楼层" >
					<el-input v-model="addForm.floor" auto-complete="off" style="width:200px"></el-input>
					<span>层</span>
				</el-form-item>
				<el-form-item label="构造" >
					<el-input v-model="addForm.structure" auto-complete="off" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" >
					<el-input v-model="addForm.tel" auto-complete="off" style="width:300px"></el-input>
				</el-form-item>
				<el-form-item label="电类型">
					<el-radio-group v-model="addForm.state">
						<el-radio class="radio" :label="1">商用电</el-radio>
						<el-radio class="radio" :label="0">民用电</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="三通">
					<el-checkbox-group>
					    <el-checkbox label="水"></el-checkbox>
					    <el-checkbox label="电"></el-checkbox>
					    <el-checkbox label="气"></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="商铺状态">
					<el-select v-model="filters.date" placeholder="请选择">
				    <el-option label="待租" value="0"></el-option>
				    <el-option label="已租" value="1"></el-option>
				    <el-option label="待售" value="2"></el-option>
				    <el-option label="其他" value="3"></el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="租赁期" >
					<div>
						<el-input v-model="addForm.tel" auto-complete="off" style="width:150px"></el-input>
						<span>月</span>
						<el-input v-model="addForm.tel" auto-complete="off" style="width:150px;margin-left:10px"></el-input>
						<span>元</span>
						<i class="fa fa-plus-square-o handleIcon"></i>
						<i class="fa fa-minus-square-o handleIcon"></i>
					</div>
				</el-form-item>
				<el-form-item label="其他">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div>
				<label style="display:block;margin:10px 0;">商铺图片：</label>
				<up-loader  @fileChanged="getFileChanged($event)" :finished="addfinish"></up-loader>
			</div>
			<div style="margin-top: 20px">
				<code-uploader :finished="addfinish" :status="addStatus" @getCodeUrl="configCodeUrl($event)"></code-uploader>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { changeState,editMerchant, addMerchant,getMerchantListPage,getShopListPage,getClassfyOpt} from '../../api/api';
  	import upLoader from '../../components/uploader'
	import codeUploader from '../../components/codeUploader.vue'
	export default {
    components:{upLoader,codeUploader},
		data() {
			return {
				selClassfyOpt:[],
				classfyOpt: [],
				merchantId:0,
				dateOptions:[{value: 'day-7',label: '最近7天'},
							 {value: 'day-15',label: '最近15天'}, 
							 {value: 'mon-1',label: '最近1个月'}, 
		        			 {value: 'mon-3',label: '最近3个月'}, 
		        			 {value: 'mon-6',label: '最近6个月'}],
				filters: {
					name: '',
					date:''
				},
				merchants:[],
				shops:[],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					name: '',
		            shopNum:0,
		            concats:'',
		            tel:'',
		            state:'',
				    addr: '',
		            recordFiles:[],//备案信息
		            //codeUrl:'',
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name:'',//商铺名
				    type:'',//商铺分类
				    position:'',//经纬度坐标位置
				    shopAddr:'',//地址
				    expireTime:'',//到期时间
				    shopState:0,//商铺状态0待租，1已租，2已售，3其他
				    shopArea:0,//商铺面积
				    maxHight:0,//总层高
				    floor:0,//楼层
				    structure:'',//构造
				    waterEle: [],//"水","电","气"
				    eleType:0,//电类型，0民用，1商用
				    rentType:[{//租赁期
				      time:'',//多少个月
				      fee:''//月租
				    }],
				    remarks:'',//其他
				    recordFiles:[{//商铺图片
				      name:'',
				      src:""
				    }],
				    qrCode:{//二维码
				      name:'',
				      src:""
				    }
		        },
				addfinish:false,
				addStatus:'ready'
			}
		},
		methods: {
			handleClassfyOptChange(value){
				console.log(value)
			},
			configCodeUrl(data){
				console.log(data)
			},
			getEidtFileChanged(files){
				//console.log(files)
				this.editForm.recordFiles = files
			},
	      	getFileChanged(files){//新增备案信息的改变
				this.addForm.recordFiles = files
			},
			formatState(row, column){
			  return row.shopState == 1 ? '已租' : row.state == 0 ? '待租': row.state == 2 ? '已售': '其他' ;
			},
			handleCurrentChange(val) {
				this.page = val;
       			 this.getMerchants();
			},
			//获取商铺列表
			getShops(){
				let para = {
						merchantId:this.merchantId,
			       		page: this.page,
			      		date: this.filters.date,
			      		name: this.filters.name,
			      		rows:10
			    	};
			    this.listLoading = true;
				getShopListPage(para).then((res)=>{
					//console.log(res)
					let{msg,success}=res.data
					if(success){
			            this.total = res.data.total;
			            this.shops = res.data.rows;
			            console.log(this.shops)
					}else{
			            this.$message({
			              message: msg,
			              type: 'error'
			            });
					}
		          	this.listLoading = false;
				}).catch((err)=>{
					console.log(err)
				})
			},
		      //获取商户户列表
		      getMerchants() {
		        let para = {
		          page: this.page,
		          name: this.filters.name
		        };
		        this.listLoading = true;
		        getMerchantListPage(para).then((res) => {
		        	//console.log(res.data.rows)
					let{msg,success}=res.data
					if(success){
			            this.total = res.data.total;
			            this.merchants = res.data.rows;
					}else{
			            this.$message({
			              message: msg,
			              type: 'error'
			            });
					}
		          	this.listLoading = false;
		        });
		      },
			//更改状态
			handleState: function (index, row) {
				//console.log(row)
				let state = row.state == '1'?'停用':'启用'
				this.$confirm(`确认${state}该记录吗?`, '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id ,state:row.state};
					console.log(para)
					changeState(para).then((res) => {
						//console.log(res)
						let {success,msg} = res.data
						this.listLoading = false;
						//NProgress.done();
						if(success){
							this.$message({
								message: res.data.rows,
								type: 'success'
							});
						}else{
							this.$message({
								message: msg,
								type: 'error'
							});
						}
            			this.getMerchants();
					});
				}).catch((err) => {
					console.log(err)
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				console.log(row)
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
		          	name:'',//商铺名
				    type:'',//商铺分类
				    position:'',//经纬度坐标位置
				    shopAddr:'',//地址
				    expireTime:'',//到期时间
				    shopState:0,//商铺状态0待租，1已租，2已售，3其他
				    shopArea:0,//商铺面积
				    maxHight:0,//总层高
				    floor:0,//楼层
				    structure:'',//构造
				    waterEle: [],//"水","电","气"
				    eleType:0,//电类型，0民用，1商用
				    rentType:[{//租赁期
				      time:'',//多少个月
				      fee:''//月租
				    }],
				    remarks:'',//其他
				    recordFiles:[{//商铺图片
				      name:'',
				      src:""
				    }],
				    qrCode:{//二维码
				      name:'',
				      src:""
				    }
		        }
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							console.log(para)
							editMerchant(para).then((res) => {
								let {success,msg} = res.data
								this.editLoading = false;
								if(success){
									this.$message({
										message: res.data.rows,
										type: 'success'
									});
								}else{
									this.$message({
										message: msg,
										type: 'error'
									});
								}
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
                				this.getMerchants();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
			  //console.log(this.$refs.addForm)
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
              				//console.log(this.addForm)
							let para = Object.assign({}, this.addForm);
             				 addMerchant(para).then((res) => {
								let {success,msg} = res.data
								this.addLoading = false;
								if(success){
									this.$message({
										message: res.data.rows,
										type: 'success'
									});
								}else{
									this.$message({
										message: msg,
										type: 'error'
									});
								}
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.addfinish = true
                				this.getMerchants();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			getClassfyOptions(){
				let para = {}
				getClassfyOpt(para).then((res) => {
					//console.log(res.data)
					let{msg,success,rows}=res.data
					if(success){
			           this.classfyOpt = rows
					}else{
			            this.$message({
			              message: msg,
			              type: 'error'
			            });
					}
		        });
			},
			goBack(){
				this.$router.go(-1)
			}
		},
		mounted() {
      		this.getMerchants();
      		this.getShops();
      		this.getClassfyOptions();//获取商铺的全部分类
		}
	}

</script>

<style scoped>
	.handleIcon{
		font-size: 24px;
		margin-left: 10px;
		color: #48576a;
	}
</style>