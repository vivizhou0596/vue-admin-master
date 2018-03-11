<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="商户名"></el-input>
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
		<el-table :data="merchants"  highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="id" label="商户ID" width="120" >
			</el-table-column>
			<el-table-column prop="name" label="商户名称" width="120" >
			</el-table-column>
			<!-- <el-table-column prop="classfy" label="分类" width="120" >
			</el-table-column> -->
			<el-table-column prop="shopNum" label="商铺量" width="100" sortable>
			</el-table-column>
			<el-table-column prop="addr" label="地址" min-width="180" >
			</el-table-column>
			<el-table-column prop="tel" label="电话" width="180">
			</el-table-column>
			<el-table-column prop="state" label="状态" width="120"  :formatter="formatState">
			</el-table-column>
			<el-table-column label="操作" width="250">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="small" type="info" @click="handleDetial(scope.$index, scope.row)">商铺信息</el-button>
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
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="商铺数量">
					<el-input-number v-model="addForm.shopNum" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="联系人" >
					<el-input v-model="addForm.concats" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" >
					<el-input v-model="addForm.tel" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="addForm.state">
						<el-radio class="radio" :label="1">正常</el-radio>
						<el-radio class="radio" :label="0">停用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div>
				<label style="display:block;margin:10px 0;">备案信息：</label>
				<up-loader  @fileChanged="getFileChanged($event)" :finished="addfinish"></up-loader>
			</div>
			<!-- <div style="margin-top: 20px">
				<code-uploader :finished="addfinish" :status="addStatus" @getCodeUrl="configCodeUrl($event)"></code-uploader>
			</div> -->
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { changeState,editMerchant, addMerchant,getMerchantListPage } from '../../api/api';
  	import upLoader from '../../components/uploader'
	import codeUploader from '../../components/codeUploader.vue'
	export default {
    components:{upLoader,codeUploader},
		data() {
			return {
				filters: {
					name: ''
				},
				merchants:[],
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
					name: '',
		            shopNum:0,
		            concats:'',
		            tel:'',
		            state:'',
				    addr: '',
		            recordFiles:[],//备案信息
		        },
				addfinish:false,
			}
		},
		methods: {
			getEidtFileChanged(files){
				//console.log(files)
				this.editForm.recordFiles = files
			},
	      	getFileChanged(files){//新增备案信息的改变
				this.addForm.recordFiles = files
			},
			formatState(row, column){
			  return row.state == 1 ? '正常' : row.state == 0 ? '停用' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
       			 this.getMerchants();
			},
		      //获取商户户列表
		      getMerchants() {
		        let para = {
		          page: this.page,
		          rows:10,
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
		    handleDetial(index,row){
		    	console.log(row.id)
		    	this.$router.push({ 
		    		path: '/shops',
		    		name: 'shops',
        			params:{id:row.id} 
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
								message: msg,
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
		          	name: '',
		            shopNum:0,
		            concats:'',
		            tel:'',
		            state:'',
		            addr: '',
		          	//codeUrl:'',
		            recordFiles:[],//备案信息
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
										message: msg,
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
							console.log(para)
             				 addMerchant(para).then((res) => {
								let {success,msg} = res.data
								this.addLoading = false;
								if(success){
									this.$message({
										message: msg,
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
		},
		mounted() {
      		this.getMerchants();
		}
	}

</script>

<style scoped>

</style>