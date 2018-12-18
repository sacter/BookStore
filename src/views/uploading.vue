<style>
    .unloading .first-li .ivu-upload-drag,.unloading  .first-li .ivu-upload,.unloading img{
        width: 160px;
        height: 160px;
        border: 1px solid #dcdee2;
    }
    .unloading>ul,.unloading>ul>li>ul{
        width: 660px;
    }
    .unloading .up-img{
        line-height: 160px;
    }
    .unloading p{
        width: 70px;
        text-align: right;
        line-height: 31px;
    }
</style>
<style scoped>
    .unloading>ul>li{
        display: flex;
        margin-top:20px;
    }
    .unloading>ul>li>ul>li{
        display: flex;
        margin-right:20px;
    }
</style>
<template>
    <div class="unloading">
        <div class="comp-title flex justify">
            <h2>上传作品</h2>
            <Button type="primary" icon="ios-arrow-back" :size="large" @click="goBack">返回</Button>
        </div>
        <ul>
            <li class="first-li">
                <p>封面：</p>
                <Upload
                    :format="['jpg','png','svg','jpeg']"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    :before-upload="handleBeforeUpload"
                    :action="imgUpUrl">
                    <div>
                        <Icon v-if="!params.bookPic" type="md-add" class="up-img" size="80"></Icon>
                        <img :src="params.bookPic" v-if="params.bookPic">
                    </div>
                </Upload>
            </li>
            <li>
                <p>作品名：</p>
                <Input v-model="params.bookName" placeholder="请输入作品名" style="width: 300px" />
            </li>
            <li>
                <p>作者：</p>
                <Input v-model="params.author" placeholder="请输入作者(必填)" style="width: 300px" />
            </li>
            <li>
                <p>简介：</p>
                <Input v-model="params.introduce" type="textarea" :rows="6" style="width: 300px" placeholder="请输入简介(必填)" />
            </li>
            <li v-if="!bookId">
                <p>内容：</p>
                <Upload
                    :format="['txt','text','doc','docx']"
                    :show-upload-list="false"
                    :on-success="txtSuccess"
                    :before-upload="txtBeforeUpload"
                    :action="imgUpUrl">
                    <Button icon="ios-cloud-upload-outline">点此上传</Button>
                </Upload>
            </li>
            <li>
                <ul class="flex justify">
                    <li>
                        <p>一级分类：</p>
                        <Select v-model="params.channel" style="width:140px" @on-change="selectChannel">
                            <Option v-for="item in channel" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </li>
                    <li>
                        <p>二级分类：</p>
                        <Select v-model="params.category" v-if="!classification.length" style="width:140px" disabled></Select>
                        <Select v-model="params.category" v-if="classification.length" style="width:140px">
                            <Option v-for="item in classification" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </li>
                    <li style="margin-right:0">
                        <p>完结状态：</p>
                        <Select v-model="params.end" style="width:140px">
                            <Option v-for="item in status" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </li>
                    <li>
                        <p>来源：</p>
                        <Select v-model="params.source" style="width:140px">
                            <Option v-for="item in comefrom" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </li>
                </ul>
            </li>
        </ul>
        <Button type="primary" @click="submit" style="margin-top: 40px;">提交</Button>
    </div>
</template>
<script>
    import {status,channel} from '../const-data/list-key.js'
    export default {
        created () {
            this.bookId = sessionStorage.getItem('edit-bookId')
            if (this.bookId) {
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/getBookInfo',{params:{bookId:this.bookId}}).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.params.end = result.data.over.toString()
                        this.params.bookPic =result.data.bookPic
                        this.params.over =result.data.over
                        this.params.bookName = result.data.name
                        this.params.introduce = result.data.introduce
                        this.params.channel = result.data.channel
                        this.params.category = result.data.category
                        this.params.name = result.data.name
                        this.params.author = result.data.author
                        this.params.source = result.data.source
                        this.selectChannel(this.params.channel)
                    } 
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                })
            }
            
            let promise1 = new Promise((resolve, reject) => {
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/getBookSource').then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.comefrom = this.setData(result.data)
                        this.params.source = this.comefrom[0].id
                        this.selectChannel(this.params.source)
                    } 
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                })
            })
            Promise.all([promise1])
        },
        data () {
            return {
                large:'large',
                imgUpUrl:'',
                bookId:'',
                comefrom: [], //来源
                classification: [], //分类
                status: status, //状态
                channel: channel, //频道
                params:{
                    bookPic:'',
                    author:'',
                    bookName:'',
                    introduce:'',
                    file:'',
                    channel:0,
                    category:'',
                    end:'1',
                    source:'',
                },
                model1:'大幅度发',
                value:''
            }
        },
        methods: {
            goBack () {
                this.$router.go(-1)
            },
            handleSuccess (res, file) {
                this.uploadImg(file)       
            },
            handleBeforeUpload (file) {
                this.uploadImg(file)
            },
            selectChannel (s) { // 选择男频、女频
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/getCategory',{params:{sex:this.params.channel}}).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        result.data.man = result.data.man || []
                        result.data.woman = result.data.woman || []
                        this.classification = result.data.man.concat(result.data.woman)
                    }  
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    } 
                })
            },
            uploadImg (file) {
                let param = new FormData(); //创建form对象
                param.append('file',file);//通过append向form对象添加数据
                let config = {  //添加请求头
                    headers:{'Content-Type':'multipart/form-data'}
                };
                this.$axios.post(this.URL + 'adminUserAuth/backstage/file/uploadFile',param,config).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.params.bookPic = result.data
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    this.$Message.warning('上传封面失败!');
                })
            },
            txtSuccess (file) {
                this.params.file = file
            },
            txtBeforeUpload (file) {
                this.params.file = file   
            },
            submit () {
                if (!this.params.bookPic) {
                    this.$Message.warning('作品封面不能为空!');
                    return
                }
                if (!this.params.author) {
                    this.$Message.warning('作者不能为空!');
                    return
                }
                if (!this.params.introduce) {
                    this.$Message.warning('简介不能为空!');
                    return
                }
                if (!this.params.file && !this.bookId) {
                    this.$Message.warning('请选择作品内容!');
                    return
                }               
                // if (this.params.channel == '') {
                //     this.$Message.warning('一级分类不能为空!');
                //     return
                // }
                if (this.params.category == '') {
                    this.$Message.warning('二级分类不能为空!');
                    return
                }
                // if (this.params.end == '') {
                //     this.$Message.warning('完结状态不能为空!');
                //     return
                // }
                // if (this.params.source == '') {
                //     this.$Message.warning('来源不能为空!');
                //     return
                // }
                if (this.bookId) {
                    this.params.bookId = Number(this.bookId)
                    this.params.source = Number(this.params.source)
                    this.params.over = this.params.over.toString()
                    this.params.name = this.params.bookName
                }
                let param = new FormData(); //创建form对象
                for (let item in this.params) {
                    param.append(item,this.params[item])
                }
                let config = {  //添加请求头
                    headers:{'Content-Type':'multipart/form-data'}
                };
                if (!this.bookId) { // 新增
                    this.$axios.post(this.URL + 'adminUserAuth/bookstore/saveBookInfo',param,config).then(res =>{
                        let result = res.data
                        if (result.code == 200) {
                            this.$Message.success('作品上传成功!');
                            this.$router.push('/Index/')
                        }
                        if (result.errorCode == 90002) {
                            this.$router.push('/')
                        }
                    }).catch(err => {
                        this.$Message.warning('作品上传失败!');
                    })
                } else {
                    this.$axios.post(this.URL + 'adminUserAuth/bookstore/updateBookInfo',param,config).then(res =>{
                        let result = res.data
                        if (result.code == 200) {
                            this.$Message.success('作品编辑成功!');
                            this.$router.push('/Index/')
                        }
                        if (result.errorCode == 90002) {
                            this.$router.push('/')
                        }
                    }).catch(err => {
                        this.$Message.warning('作品编辑失败!');
                    })
                }
            },
            setData (arr) {
                if (arr && arr.length) {
                    arr.forEach(item => {
                        if (item.id || item.key) {
                            item.id = item.id || item.key
                        }
                        if (item.value || item.name) {
                            item.name = item.value || item.name
                        }
                    })
                    return arr
                }
            }
        }
    }
</script>
