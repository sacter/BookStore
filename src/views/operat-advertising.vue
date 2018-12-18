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
            <h2>{{mTitle}}广告</h2>
            <Button type="primary" icon="ios-arrow-back" :size="large" @click="goBack">返回</Button>
        </div>
        <ul>
            <li>
                <p>广告名称：</p>
                <Input v-model="advert.title" placeholder="请输入广告名称" style="width: 300px" />
            </li>
            <li>
                <p>广告位置：</p>
                <Select v-model="advert.position" style="width:140px">
                    <Option v-for="item in channel" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </li>
            <li v-if="mTitle !== '添加'">
                <p>是否启用：</p>
                <RadioGroup v-model="advert.statuss" @on-change="toUse">
                    <Radio label="是"></Radio>
                    <Radio label="否"></Radio>
                </RadioGroup>
            </li>
            <li>
                <p>广告图片：</p>
                <Upload
                    v-if="!advert.image"
                    :format="['jpg','png','svg','jpeg']"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    :before-upload="handleBeforeUpload"
                    :action="imgUpUrl">
                    <Button icon="ios-cloud-upload-outline">点此上传</Button>
                </Upload>
                <img :src="advert.image" v-if="advert.image">
            </li>
            <li>
                <p>广告链接：</p>
                <Input v-model="advert.url" placeholder="请输入广告链接" style="width: 300px" />
            </li>
        </ul>
        <Button type="primary" @click="submit" style="margin-top: 40px;">提交</Button>
    </div>
</template>
<script>
    import {status,channel} from '../const-data/list-key.js'
    export default {
        created () {
            this.mTitle = sessionStorage.getItem('mTitle')
            if (JSON.parse(sessionStorage.getItem('advert'))) {
                this.advert = JSON.parse(sessionStorage.getItem('advert'))
                this.advert.statuss = this.advert.status===1?'是':'否'
            }
        },
        data () {
            return {
                mTitle:'添加',
                large:'large',
                imgUpUrl:'',
                channel: channel, //频道
                advert:{
                    title:'',
                    position:9999,
                    image:'',
                    url:'',
                    statuss:'是',
                },
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
            uploadImg (file) {
                let param = new FormData(); //创建form对象
                param.append('file',file);//通过append向form对象添加数据
                let config = {  //添加请求头
                    headers:{'Content-Type':'multipart/form-data'}
                };
                this.$axios.post(this.URL + 'adminUserAuth/backstage/file/uploadFile',param,config).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.advert.image = result.data
                        this.$Message.success('上传广告图片成功!');
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    this.$Message.warning('上传广告图片失败!');
                })
            },
            toUse () { // 启禁用广告
                let status = this.advert.statuss === '是'?1:0
                let param = new FormData()
                param.append('id',this.advert.id)
                param.append('status',status)    
                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                };
                this.$axios.post(this.URL + 'adminUserAuth/bookstore/enablePoster',param,config).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.$Message.success('启禁用广告成功!')
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    this.$Message.warning('启禁用广告失败!');
                })
            },
            submit () {
                console.log(this.advert);
                
                if (!this.advert.title) {
                    this.$Message.warning('广告名称不能为空!');
                    return
                }
                if (this.advert.position == 9999) {
                    this.$Message.warning('广告位置不能为空!');
                    return
                }               
                let param = new FormData(); //创建form对象
                for (let item in this.advert) {
                    param.append(item,this.advert[item])
                }
                let config = {  //添加请求头
                    headers:{'Content-Type':'multipart/form-data'}
                }
                if (this.mTitle === '添加') {
                    this.$axios.post(this.URL + 'adminUserAuth/bookstore/addPoster',param,config).then(res =>{
                        let result = res.data
                        if (result.code == 200) {
                            this.$Message.success(`${this.mTitle}成功!`)
                            this.$router.push('/AdvertisingManag')
                        }
                        if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                    }).catch(err => {
                        this.$Message.warning(`${this.mTitle}失败!`)
                    })
                } else {
                    this.$axios.post(this.URL + 'adminUserAuth/bookstore/updatePoster',param,config).then(res =>{
                        let result = res.data
                        if (result.code == 200) {
                            this.$Message.success(`${this.mTitle}成功!`)
                            this.$router.push('/AdvertisingManag')
                        }
                        if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                    }).catch(err => {
                        this.$Message.warning(`${this.mTitle}失败!`)
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
