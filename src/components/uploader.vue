<template>
    <div class="vue-uploader">
        <div class="file-list">
            <section v-for="(file, index) in files" class="file-item draggable-item">
                <img :src="file.src" alt="" ondragstart="return false;">
                <p class="file-name">{{file.name}}</p>
                <span class="file-remove" @click="remove(index)">+</span>
            </section>
            <section v-if="status == 'ready'" class="file-item">
                <div @click="add" class="add">
                    <span>+</span>
                </div>
            </section>
        </div>
        <input type="file"  @change="fileChanged" ref="file" multiple="multiple" >
        <!-- <input type="file"  @change="fileChanged" ref="file" > -->
    </div>
</template>
<script>
    export default {
        props: {
            finished:{
              type: Boolean,
              default:false,
              required: true
            },
            imgFiles:{
                 type:Array,
                 default(){
                    return []
                 }
            }
        },
        watch:{
          finished(data){
            if(data){
                this.files = []
            }
          },
          imgFiles(data){
            console.log(data)
            this.files = data
          }
        },
        mounted(){
            console.log(this.imgFiles)
            this.files = this.imgFiles
        },
        data() {
            return {
                status: 'ready',
                files: [],
                point: {},
                uploading: false,
                percent: 0
            }
        },
        methods: {
            add() {
                // if(multiple){
                //     this.$refs.file.click()
                // }
                 this.$refs.file.click()
            },
            // submit() {
            //     if (this.files.length === 0) {
            //         console.warn('no file!');
            //         return
            //     }
            //     const formData = new FormData()
            //     this.files.forEach((item) => {
            //         formData.append(item.name, item.file)
            //     })
            //     const xhr = new XMLHttpRequest()
            //     xhr.upload.addEventListener('progress', this.uploadProgress, false)
            //     xhr.open('POST', this.src, true)
            //     this.uploading = true
            //     xhr.send(formData)
            //     xhr.onload = () => {
            //         this.uploading = false
            //         if (xhr.status === 200 || xhr.status === 304) {
            //             this.status = 'finished'
            //             console.log('upload success!')
            //         } else {
            //             console.log(`error：error code ${xhr.status}`)
            //         }
            //     }
            // },
            remove(index) {
                this.files.splice(index, 1)
                this.$emit('fileChanged',this.files)
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
            },
            // uploadProgress(evt) {
            //     const component = this
            //     if (evt.lengthComputable) {
            //         const percentComplete = Math.round((evt.loaded * 100) / evt.total)
            //         component.percent = percentComplete / 100
            //     } else {
            //         console.warn('upload progress unable to compute')
            //     }
            // }
        }
    }
</script>
<style>
.vue-uploader {
    border: 1px solid #e5e5e5;
}
.vue-uploader .file-list {
    padding: 10px 0px;
}
.vue-uploader .file-list:after {
    content: '';
    display: block;
    clear: both;
    visibility: hidden;
    line-height: 0;
    height: 0;
    font-size: 0;
}
.vue-uploader .file-list .file-item {
    float: left;
    position: relative;
    width: 100px;
    text-align: center;
}
.vue-uploader .file-list .file-item img{
    width: 80px;
    height: 80px;
    border: 1px solid #ececec;
}
.vue-uploader .file-list .file-item .file-remove {
    position: absolute;
    right: 12px;
    display: none;
    top: 4px;
    width: 14px;
    height: 14px;
    color: white;
    cursor: pointer;
    line-height: 12px;
    border-radius: 100%;
    transform: rotate(45deg);
    background: rgba(0, 0, 0, 0.5);
}
.vue-uploader .file-list .file-item:hover .file-remove {
    display: inline;
}
.vue-uploader .file-list .file-item .file-name {
    margin: 0;
    height: 40px;
    word-break: break-all;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.vue-uploader .add {
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
.vue-uploader .upload-func {
    display: flex;
    padding: 10px;
    margin: 0px;
    background: #f8f8f8;
    border-top: 1px solid #ececec;
}
.vue-uploader .upload-func .progress-bar {
    flex-grow: 1;
}
.vue-uploader .upload-func .progress-bar section {
    margin-top: 5px;
    background: #00b4aa;
    border-radius: 3px;
    text-align: center; 
    color: #fff;
    font-size: 12px;
    transition: all .5s ease;
}
.vue-uploader .upload-func .operation-box {
    flex-grow: 0;
    padding-left: 10px;
}
.vue-uploader .upload-func .operation-box button {
    padding: 4px 12px;
    color: #fff;
    background: #007ACC;
    border: none;
    border-radius: 2px;
    cursor: pointer;
}
.vue-uploader > input[type="file"] {
    display: none;
}
</style>