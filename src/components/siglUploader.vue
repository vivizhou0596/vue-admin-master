<template>
  <div>
    <section  class="file-item">
      <div class="add"  @click="add">
        <span>+</span>
      </div>
      <img :src="files[0]&&files[0].src" alt="logo" v-if="files[0]" style="margin:0 10px">
    </section>
    <input type="file"  @change="fileChanged" ref="file" style="display:none">
  </div>
</template>

<script>
  export default {
    props: {
      imgFiles:{
           type:Object,
           default(){
              return {}
           }
      }
    },
    watch:{
      imgFiles(data){
        console.log(data)
        this.files[0] = data
      }
    },
    created(){
      this.files[0] = this.imgFiles
      //console.log(this.files[0])
    },
    data() {
      return {
        files: [],
        codeUrl:'',
      }
    },
    methods: {
      add() {
        this.$refs.file.click()
      },
      fileChanged() {
        this.files = []
        const list = this.$refs.file.files
        console.log(list)
        for (let i = 0; i < list.length; i++) {
          if (!this.isContain(list[i])) {
            const item = {
              name: list[i].name,
              size: list[i].size,
              file: list[i]
            }
            this.html5Reader(list[i], item)
            this.files.push(item)
          }
        }
        this.$refs.file.value = ''
        this.$emit('fileChanged',this.files)
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