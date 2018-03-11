<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getClassify">查询</el-button>
					<el-button type="primary" v-on:click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="Classifys" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column prop="id" label="ID" >
				</el-table-column>
				<el-table-column prop="name" label="一级目录" width="120" >
				</el-table-column>
				<el-table-column prop="icon" label="ICON" width="100">
					<template scope="scope">
						<img :src="scope.row.icon.src" alt="icon" style="width:24px;height:24px">
					</template>
				</el-table-column>
				<el-table-column prop="subName" label="二级目录" >
					<template scope="scope">
						<span v-for=" item in scope.row.subName">{{item.name}},</span>
					</template>
				</el-table-column>
				<el-table-column prop="sort" label="排序" width="120" sortable>
				</el-table-column>
				<el-table-column label="操作" width="150">
					<template scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</template>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
				<el-form-item label="一级目录:" prop="name">
					<div class="second-item" >
						<el-input v-model="addForm.name" auto-complete="off" style="width:200px">
						</el-input>
						<sigl-uploader
							@fileChanged = "topItemIconChange($event,'add')"
							:imgFiles="addForm.icon">
						</sigl-uploader>
					</div>
				</el-form-item>
				<el-form-item label="二级目录:" prop="subName">
					<!-- <template scope="scope"> -->
						<div class="second-item" v-for="(item,index) in addForm.subName">
							<el-input v-model="item.name" auto-complete="off" style="width:200px">
							</el-input>
							<sigl-uploader 
								@fileChanged = "subItemIconChange($event,index,'add')"
								:imgFiles="item.files">
							</sigl-uploader>
							<p v-if="index !=0 " @click="delSubItem(index,'add')">-</p>
						</div>
					<!-- </template> -->
				<el-button type="primary" size="mini" @click="addSubItem('add')">增加一条</el-button>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!-- 编辑界面 -->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-form-item label="一级目录:" prop="name">
					<div class="second-item" >
						<el-input v-model="editForm.name" auto-complete="off" style="width:200px">
						</el-input>
						<sigl-uploader 
							@fileChanged = "topItemIconChange($event,'edit')"
							:imgFiles="editForm.icon">
						</sigl-uploader>
					</div>
				</el-form-item>
				<el-form-item label="二级目录:" prop="subName">
					<!-- <template scope="scope"> -->
						<div class="second-item" v-for="(item,index) in editForm.subName">
							<el-input v-model="item.name" auto-complete="off" style="width:200px">
							</el-input>
							<sigl-uploader 
								@fileChanged = "subItemIconChange($event,index,'edit')"
								:imgFiles="item.files">
							</sigl-uploader>
							<p v-if="index !=0 " @click="delSubItem(index,'edit')">-</p>
						</div>
					<!-- </template> -->
				<el-button type="primary" size="mini" @click="addSubItem('edit')">增加一条</el-button>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
	import {getClassify,addClassify,editClassify,removeClassify} from '../../api/api';
	import upLoader from '../../components/uploader'
	import siglUploader from '../../components/siglUploader.vue'
	export default {
	  components:{ upLoader,siglUploader},
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
		        Classifys:[],
		        addFormVisible: false,//新增界面是否显示
		        addLoading: false,
		        // addStatus: 'ready',
		        // addfinish:false,
		        addFormRules: {
		          name: [
		            { required: true, message: '请输入姓名' }
		          ],
		          subName: [
		            { required: true, message: '请输入姓名'}
		          ],
		        },
		        addForm: {//新增界面数据
		            name:'',
		      		icon:{
			          	name:'',
			          	src:''
				    },
		          	subName:[{
			          	name:'',
			          	files:{
				          	name:'',
				          	src:''
				          }
			          }]
		        },
		        editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				// addStatus: 'ready',
		  //       addfinish:false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名'}
					],
					subName: [
			            { required: true, message: '请输入姓名'}
			        ]
				},
				//编辑界面数据
				editForm: {
					name:'',
		      		icon:{
			          	name:'',
			          	src:''
				    },
		          	subName:[{
			          	name:'',
			          	files:{
				          	name:'',
				          	src:''
				        }
			        }]
				}
		    }
		},
		methods: {
		    getClassify(){
		        let para = {
		          name: this.filters.name
		        };
		        this.loading = true;
		        console.log(para)
		        getClassify(para).then((res) => {
		            //console.log(res.data.rows)
					let{success,msg}=res.data
					if(success){
		            	this.Classifys = res.data.rows;
					}else{
			            this.$message({
			              message: msg,
			              type: 'error'
			            });
					}
					this.loading = false;
		          //NProgress.done();
		        });
			},
		    //显示新增界面
		    handleAdd: function () {
		      this.addFormVisible = true;
		      this.addForm = {
		      		name:'',
		      		icon:{
			          	name:'',
			          	src:''
				    },
		          	subName:[{
			          	name:'',
			          	files:{
				          	name:'',
				          	src:''
				          }
			          }
			        ]
		      };
		    },
		    //追加一条二级目录
		    addSubItem(type){
		    	if(type == 'add'){
		    		this.addForm.subName.push({
			    		name:'',
			          	files:{
				          	name:'',
				          	src:''
				        }
			    	})
		    	}else if(type == 'edit'){
		    		this.editForm.subName.push({
			    		name:'',
			          	files:{
				          	name:'',
				          	src:''
				        }
			    	})
		    	}
		    },
		    //删除一条二级目录
		    delSubItem(index,type){
		    	console.log(type)
		    	if(type == 'add'){
		    		this.addForm.subName.splice(index, 1)
		    	}else if(type == 'edit'){
		    		this.editForm.subName.splice(index, 1)
		    	}
		    },
		    //一级目录图片更新操作
		    topItemIconChange(data,type){
		    	console.log(type)
		    	if(type == 'add'){
		    		this.addForm.icon = data[0];
		    	}else if(type == 'edit'){
		    		this.editForm.icon = data[0];
		    	}
		    },
		    //图片更新操作
		    subItemIconChange(data,index,type){
		    	console.log(type)
		    	if(type == 'add'){
		    		this.addForm.subName[index].files = data[0];
		    	}else if(type == 'edit'){
		    		this.editForm.subName[index].files = data[0];
		    	}
		    },
		    //新增提交
		    addSubmit(){
		    	this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
              				//console.log(this.addForm)
							let para = Object.assign({}, this.addForm);
							//console.log(para)
             				 addClassify(para).then((res) => {
             				 	console.log(res)
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
                				this.getClassify();
							});
						});
					}
				});
		    },
		    //显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				console.log(row)
				this.editForm = Object.assign({}, row);
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							//console.log(para)
							editClassify(para).then((res) => {
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
                				this.getClassify();
							});
						});
					}
				});
			},
			//删除一条数据
			handleDel: function (index, row) {
				//console.log(row)
				//let state = row.state == '1'?'停用':'启用'
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					removeClassify(para).then((res) => {
						//console.log(res)
						let {success,msg} = res.data
						this.listLoading = false;
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
            			this.getClassify();
					});
				}).catch(() => {

				});
			},
		},
		mounted() {
			//this.getUser();
			this.getClassify();
		}
	};

</script>

<style scoped>
	.second-item{
		display: flex;
		align-items: center;
		border-radius: 5px;
		margin-top: 10px;
	}
	.second-item p{
		font-size: 20px;
		width:20px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		border: 1px solid #ddd;
		border-radius:50%; 
		margin-left: 10px;
		cursor: pointer;
	}
</style>