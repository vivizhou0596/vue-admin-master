<template>
  <div>
    <span >二维码:</span>
    <section  class="file-item">
      <div class="add" v-if="newStatus == 'ready'" @click="add">
        <span>+</span>
      </div>
      <img :src="files[0]&&files[0].src" alt="logo" v-if="files[0]" style="margin:0 10px">
      <img :src="codeUrl" alt="二维码" v-if="newStatus != 'ready'">
      <!--<img src="" alt="">-->
    </section>
    <el-button size="mini" type="primary" v-if="newStatus == 'ready'" @click="submit" >生成二维码</el-button>
    <el-button size="mini" type="primary" v-if="newStatus != 'ready'" @click="change">换一换</el-button>
    <input type="file"  @change="fileChanged" ref="file" style="display:none">
  </div>
</template>

<script>
  import { getCodeUrl } from '../api/api';
  export default {
    props: {
      status:{
        type: String,
        default:'ready',
        required: true,
      },
      finished:{
        type: Boolean,
        default:false,
        required: true
      }
    },
    watch:{
      finished(data){
        if(data){
          this.newStatus = 'ready'
          this.files = []
        }
      }
    },
    mounted(){
      this.newStatus = this.status
    },
    data() {
      return {
        files: [],
        codeUrl:'',
        newStatus:''
      }
    },
    methods: {
      change(){
        this.newStatus = 'ready'
      },
      add() {
        this.$refs.file.click()
      },
      submit() {
        if (this.files.length === 0) {
          console.warn('no file!');
          return
        }
        const formData = new FormData()
        this.files.forEach((item) => {
          formData.append(item.name, item.file)
        })
        getCodeUrl(formData).then((res)=>{
          let{msg,success} = res
          if(success){
            this.codeUrl = res.rows;
            this.newStatus = 'finish';
            this.$emit('getCodeUrl',this.codeUrl)
          }else{
            this.$message({
              message: msg,
              type: 'error'
            });
          }
        }).catch((err)=>{
          console.log(err)
          this.$message({
            message: '二维码生成失败，稍后重试',
            type: 'error'
          });
        })
      },
      fileChanged() {
        const list = this.$refs.file.files
        for (let i = 0; i < list.length; i++) {
          if (!this.isContain(list[i])) {
            const item = {
              name: list[i].name,
              size: list[i].size,
              file: list[i]
            }
            this.html5Reader(list[i], item)
            this.files.push(item)
            if(this.files.length>1){
               this.files.shift()
            }
          }
        }
        this.$refs.file.value = ''
      },
      // 将图片文件转成BASE64格式
      html5Reader(file, item){
        const reader = new FileReader()
        reader.onload = (e) => {
          this.$set(item, 'src', e.target.result)
        }
        reader.readAsDataURL(file)
      },
      isContain(file) {
        this.files.forEach((item) => {
          if(item.name === file.name && item.size === file.size) {
            return true
          }
        })
        return false
      }
    }
  }
</script>
<style scoped>
  .file-item {
    display:inline-block;
    vertical-align:middle;
    position: relative;
    /*width: 100px;*/
    text-align: center;
  }

  .add {
    width: 80px;
    height: 80px;
    margin-left: 10px;
    float: left;
    text-align: center;
    line-height: 80px;
    border: 1px dashed #ececec;
    font-size: 30px;
    cursor: pointer;
  }
  .file-item img{
    width: 80px;
    height: 80px;
    border: 1px solid #ececec;
  }
</style>