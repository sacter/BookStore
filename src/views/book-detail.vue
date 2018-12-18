<style>
    
</style>
<style scoped>
    .introduce{
        font-size:14px;
        color:#333;
        line-height: 20px;
        margin-top:52px;
    }
    .introduce p{
        text-align: left;
        width:400px;
        max-height: 140px;
        overflow: hidden;
    }
    #introduce:checked + p{
        height: auto;
    }
    #introduce:checked ~ label[for="introduce"] i{
        transform: rotate(180deg);
    }
    .introduce label{
        width: 100%;
        display: block;
        margin: auto;
        cursor: pointer;
    }
    #introduce{
        display:none;
    }
    .book-detail{
        margin-top:16px;
        position: relative;
    }
    .book-detail img{
        width: 228px;
        height: 304px;
        margin-right:20px;
    }
    .book-detail aside{
    }
    .book-nav>div{
        text-align:left;
    }
    .book-nav span{
        display: inline-block;
        font-size: 16px;
        line-height:16px;
        text-align: left;
        font-weight: 600;
        padding:0 20px;
        margin-bottom:16px;
        color:#333;
        border-left:2px solid #333;
    }
    .book-nav span:first-child{
        padding-left:0;
        border:0;
    }
    .book-name h3{
        font-size:16px;
        font-weight:600;
        color: #333333;  
        line-height:30px;
        margin-right:14px;
        margin-bottom:16px;
    }
    .book-name p{
        font-size:14px;
        color: #333333;
        line-height:30px;
    }
    .open-indo{
        color:#169BD5
    }
    .btns button{
        margin:20px 20px 20px 0;
    }
    .chapter-cont>div:first-child{
        margin-bottom:20px;
    }
    .chapter-cont p{
        width:70px;
        line-height:32px;
    }
</style>
<template>
    <div class="book-details book-store">
        <Button type="primary" icon="ios-arrow-back" :size="large" @click="goBack" style="position: absolute;right: 16px;z-index: 1000;">返回</Button>
        <div class="book-detail flex">
            <img :src="bookDetail.bookPic" alt="暂无封面">
            <aside>
                <div class="detail-top">
                    <div class="book-name flex">
                        <h3>{{bookDetail.name}}</h3>
                        <p>{{bookDetail.author}} 著</p>
                    </div>
                    <div class="book-nav">
                        <div>
                            <span>{{bookDetail.channel}}</span>
                            <span>{{bookDetail.category}}</span>
                            <span>{{bookDetail.over}}</span>
                            <span>{{bookDetail.fee?'收费':'免费'}}</span>
                        </div>
                        <div v-if="bookDetail.fee">
                            <span>{{bookDetail.fee}}书币/千字</span>
                            <span>{{bookDetail.Zstatus}}</span>
                            <span>收费章节{{bookDetail.feeChapter}}</span>
                        </div>
                    </div>
                </div>
                <div class="introduce">
                    <input type="checkbox" id="introduce">
                    <p>{{bookDetail.introduce}}</p>
                </div>
            </aside>
        </div>
        <div class="btns flex">
            <Button type="primary" @click="getChapterList">章节管理</Button>
            <Button type="primary" @click="creatChapter">新增章节</Button>
            <Button type="primary" @click="getBeReleased">待发布列表</Button>
        </div>
        <div class="tabls">
            <div v-if="!hasHandler">
                <Table border ref="selection" :columns="columns1" :data="data1"></Table>
                <Page :total="totalElements" show-total transfer placement="bottom" @on-change="changePage" @on-page-size-change="changeSize" show-elevator show-sizer/>
            </div>
            <div v-if="hasHandler">
                <Table border ref="selection" :columns="columns2" :data="pendingList"></Table>
                <Page :total="totalElements1" show-total transfer placement="bottom" @on-change="changePage1" @on-page-size-change="changeSize1" show-elevator show-sizer/>
            </div>
        </div>
        <!-- <Modal
            v-model="chapterModa"
            :title="moTitle"
            width="50%"
            :ok-text="subTitle"
            @on-ok="chapterOk">
            <div class="chapter-cont">
                <div class="flex">
                    <p>章节名称：</p>
                    <Input v-model="chapter.chapterName" placeholder="请输入章节名称" style="width: 90%"/>
                </div>
                <div class="flex">
                    <p>正文：</p>
                    <Input type="textarea" v-model="chapter.content" :rows="16" placeholder="请输入章节正文" style="width: 90%"/>
                </div>
            </div>
        </Modal> -->
        <Modal v-model="chapterModa" :title="moTitle" width = 50% :mask-closable="false" @on-cancel="cancel" class-name="vertical-center-modal">
            <Form ref="chapterline" class="chapter-cont" :model="chapter" :rules="chapterInline">
                <FormItem prop="chapterName">
                    <div class="flex">
                        <p>章节名称：</p>
                        <Input v-model="chapter.chapterName" placeholder="请输入章节名称" style="width: 90%"/>
                    </div>
                </FormItem>
                <FormItem prop="content">
                    <div class="flex">
                        <p>正文：</p>
                        <Input type="textarea" v-model="chapter.content" :rows="16" placeholder="请输入章节正文" style="width: 90%"/>
                    </div>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel()">取 消</Button>
                <Button type="primary" @click="chapterOk()">{{subTitle}}</Button>
            </div>
        </Modal>
        <Modal
            v-model="releaseModal"
            title="发布"
            width="50%"
            ok-text="发布"
            @on-ok="rleaseOk">
            <div class="chapter-cont">
                <div>
                    <p style="width:100%">发布到：第112章 新的敌人之后</p>
                </div>
                <div class="flex">
                    <p style="width:auto">选择发布时间：</p>
                    <RadioGroup v-model="releaseType">
                        <Radio label="now">立即发布</Radio>
                        <div class="flex">
                            <Radio label="setTime">定时发布</Radio>
                            <DatePicker v-model="releaseTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择定时发布时间" style="width: 200px"></DatePicker>
                        </div>
                    </RadioGroup>
                </div>
            </div>
        </Modal>
        <Modal
            v-model="delet"
            title="删除章节"
            width="50%"
            @on-ok="deletOk">
            <div class="chapter-cont">
                <p style="width:100%">是否从发布列表中是否删除该章节？</p>
            </div>
        </Modal>
    </div>
</template>
<script>
    import timestamp  from 'time-stamp';
    import { Format,getDate }  from '../util/set-date-time.js';

    export default {
        mounted () {
            this.bookId = sessionStorage.getItem('BookDetail-bookId')
            let promise1 = new Promise((resolve, reject) => {
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/getBookSource').then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.comefrom = this.setData(result.data)
                    } 
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                })
            })
            let promise2 = new Promise((resolve, reject) => {
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/getCategory').then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.classification = result.data.man.concat(result.data.woman)   
                    }   
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                })
            })
            let promise3 = new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.getDeatil()
                }, 100);
            })
            Promise.all([promise1,promise2,promise3])
        },
        data () {
            return {
                chapterInline:{
                    chapterName: [
                        { required: true, message: '请输入章节名称', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '请输入章节正文', trigger: 'blur' }
                    ],
                },
                large:'large',
                bookId:'',
                bookDetail:{}, // 书籍详情
                page:0, // 当前第几页（章节列表）
                pageSize:10, // 每页显示几条（章节列表）
                totalElements:10, // 总记条数（章节列表）
                page1:0, // 当前第几页（待发布章节列表）
                pageSize1:10, // 每页显示几条（待发布章节列表）
                totalElements1:10, // 总记条数（待发布章节列表）
                moTitle: '新增章节',
                subTitle: '上传到待发布列表', // 新增、修改章节提交tile
                chapterModa: false, // 控制新增章节模态框打开
                hasHandler: false, // true为待发表列表
                releaseModal: false, //发布模态框
                delet: false,
                pendingList: [], // 待发布列表数据
                ismodify:false, // 是否是修改
                index:'', // 修改、发布、删除index
                releaseType: 'now', // 发布方式
                releaseTime: '', // 发布时间
                chapter: { // 新增、修改章节
                    chapterName:'',
                    content:''
                },
                releaseChapter:{ // 发布章节
                    chapterId:''
                },
                delChapter:{ // 删除章节
                },
                comefrom: [], //来源
                classification: [], //分类
                columns1: [
                    {
                        title: '章节序号',
                        key: 'chapterNum',
                        align: 'center'
                    },
                    {
                        title: '章节名',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: '字数',
                        key: 'wordCount',
                        align: 'center'
                    },
                    {
                        title: '发布时间',
                        key: 'createdAt',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    style: {
                                        color: '#169BD5'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push('/ueditor')
                                            sessionStorage.setItem('chatotType','see')
                                            sessionStorage.setItem('chapterId',params.row.chapterId)
                                        }
                                    }
                                }, '查看')
                            ])
                        }
                    }
                ],
                columns2: [
                    {
                        title: '章节序号',
                        key: 'chapterNum',
                        align: 'center'
                    },
                    {
                        title: '章节名',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: '字数',
                        key: 'wordCount',
                        align: 'center'
                    },
                    {
                        title: '发布时间',
                        key: 'createdAt',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    style: {
                                        color: '#169BD5'
                                    },
                                    on: {
                                        click: () => {
                                            // this.index = params.index
                                            // let obj = params.row
                                            // this.chapter.chapterId = obj.chapterId
                                            // this.chapter.chapterName = obj.chapterName
                                            // this.getCharterCont(obj.chapterId)
                                            // this.moTitle = '修改章节'
                                            // this.subTitle = '修 改'
                                            // this.ismodify = true
                                            this.$router.push('/ueditor')
                                            sessionStorage.setItem('chatotType','edit')
                                            sessionStorage.setItem('chapterId',params.row.chapterId)
                                            sessionStorage.setItem('bookId',this.bookId)
                                        }
                                    }
                                }, '修改'),
                                h('a', {
                                    style: {
                                        color: '#169BD5',
                                        marginLeft: '30px',
                                        marginRight: '30px'
                                    },
                                    on: {
                                        click: () => {
                                            this.index = params.index
                                            this.releaseTime = params.row.releaseTime
                                            this.releaseChapter.chapterId = params.row.chapterId
                                            this.releaseModal = true
                                        }
                                    }
                                }, '发布'),
                                h('a', {
                                    style: {
                                        color: '#169BD5'
                                    },
                                    on: {
                                        click: () => {
                                            this.delChapter.chapterId = params.row.chapterId
                                            this.delet = true
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                data1: [],
            }
        },
        methods:{
            goBack () {
                this.$router.go(-1)
            },
            changePage (p) {
                this.page = p > 0 ? p - 1 : 0
                this.getChapterList()
            },
            changeSize (s) {
                this.pageSize = s
                this.getChapterList()         
            },
            changePage1 (p) {
                this.page1 = p > 0 ? p - 1 : 0
                this.getBeReleased()
            },
            changeSize1 (s) {
                this.pageSize1 = s
                this.getBeReleased()      
            },
            creatChapter () {  // 新增章节
                this.$router.push('/ueditor')
                sessionStorage.setItem('chatotType','add')
                sessionStorage.setItem('bookId',this.bookId)
                // this.chapter = {}
                // this.moTitle = '新增章节'
                // this.subTitle = '上传到待发布列表'
                // this.chapterModa = true
                // this.ismodify = false
            },
            chapterOk () {  // 新增、修改章节  
                this.$refs.chapterline.validate((valid) => {
                    if (!valid) {
                        this.$Message.warning('填写有误!')
                    } else {
                        if (!this.ismodify) { // 新增
                            this.chapter.bookId = this.bookId
                            let param = new FormData(); //创建form对象
                            for (let item in this.chapter) {
                                param.append(item,this.chapter[item])
                            }
                            let config = {  //添加请求头
                                headers:{'Content-Type':'multipart/form-data'}
                            };
                            this.$axios.post(this.URL + 'adminUserAuth/bookstore/addChapter',param,config).then(res =>{
                                let result = res.data
                                if (result.code == 200) {
                                    this.$Message.success('新增章节成功!');
                                }
                                if (result.errorCode == 90002) {
                                    this.$router.push('/')
                                }
                            }).catch(err => {
                                this.$Message.warning('新增章节失败!');
                            })
                        } else { // 修改
                            let param = new FormData(); //创建form对象
                            for (let item in this.chapter) {
                                param.append(item,this.chapter[item])
                            }
                            let config = {  //添加请求头
                                headers:{'Content-Type':'multipart/form-data'}
                            };
                            this.$axios.post(this.URL + 'adminUserAuth/bookstore/updateChapter',param,config).then(res =>{
                                let result = res.data
                                if (result.code == 200) {
                                    this.$Message.success('修改章节成功!')
                                    this.getBeReleased()
                                }
                                if (result.errorCode == 90002) {
                                    this.$router.push('/')
                                }
                            }).catch(err => {
                                this.$Message.warning('新增章节失败!');
                            })
                        }
                        this.chapter = {
                            chapterName:'',
                            content:''
                        }
                        this.chapterInline.chapterName = true
                        this.chapterModa = false
                    }
                })              
                // if (!this.chapter.chapterName) {
                //     this.$Message.warning('章节名称不能为空!')
                //     return
                // }
                // if (!this.chapter.content) {
                //     this.$Message.warning('章节正文不能为空!')
                //     return
                // }  
            },
            cancel () {
                this.chapter = {
                    chapterName:'',
                    content:''
                }
                this.$refs.chapterline.resetFields()
                this.chapterModa = false
            },
            rleaseOk () { // 发布
                // let releaseObj =  this.pendingList[this.index]
                // if (this.releaseType === 'setTime') {
                //     releaseObj.releaseTime = Format(this.releaseTime, 'yyyy-MM-dd hh:mm'); 
                // }
                console.log(this.releaseChapter);
                let param = new FormData(); //创建form对象
                for (let item in this.releaseChapter) {
                    param.append(item,this.releaseChapter[item])
                }
                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                };
                this.$axios.post(this.URL + 'adminUserAuth/bookstore/publishChapter',param,config).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.$Message.success('发布章节成功!')
                        this.getBeReleased()
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    this.$Message.warning('发布章节失败!');
                })
            },
            deletOk () {
                let param = new FormData(); //创建form对象
                for (let item in this.delChapter) {
                    param.append(item,this.delChapter[item])
                }
                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                };
                this.$axios.post(this.URL + 'adminUserAuth/bookstore/delChapter',param,config).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.$Message.success('删除章节成功!')
                        this.getBeReleased()
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    this.$Message.warning('删除章节失败!');
                })
            },
            getDeatil () { // 获取书籍详情
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/getBookInfo',{params:{bookId:this.bookId}}).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.bookDetail = result.data
                        this.bookDetail.channel = this.bookDetail.channel?'男频':'女频'
                        this.bookDetail.over = this.bookDetail.channel?'完结':'连载中'
                        this.bookDetail.Zstatus = this.bookDetail.status?'已上架':'未上架'
                        this.comefrom.forEach(com => {
                            if (this.bookDetail.source == com.id) {
                                this.bookDetail.source = com.name
                            }
                        })
                        this.classification.forEach(cla => {
                            if (this.bookDetail.category == cla.id) {
                                this.bookDetail.category = cla.name
                            }
                        })
                        this.getChapterList()
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            getBeReleased () { //获取待发布列表
                this.hasHandler = true
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/getChapters',{
                    params:{
                        bookId:this.bookId,
                        pageSize:this.pageSize1,
                        pageNum:this.page1,
                        status:0
                    }
                }).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.totalElements1 = result.data.totalElements
                        this.pendingList = result.data.content
                        this.pendingList.forEach((item,index) => {
                            item.chapterNum = index + 1
                            item.createdAt = getDate(item.createdAt)
                            item.updatedAt = getDate(item.updatedAt)
                            item.chapterName = item.title
                        })
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            getChapterList () { // 获取章节列表
                this.hasHandler = false
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/getChapters',{
                    params:{
                        bookId:this.bookId,
                        pageSize:this.pageSize,
                        pageNum:this.page,
                        status:this.bookDetail.status
                    }
                }).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.totalElements = result.data.totalElements
                        this.data1 = result.data.content
                        this.data1.forEach((item,index) => {
                            item.chapterNum = index + 1
                            item.createdAt = getDate(item.createdAt)
                            item.updatedAt = getDate(item.updatedAt)
                        })      
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    console.log(err);
                })
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
