<template>
    <div class="book-store">
        <div class="comp-title flex justify">
            <h2>热门推荐 </h2>
        </div>
        <!-- <div class="book-store-search flex">
            <Input search enter-button v-model="searchKey" @on-search="searchFun" placeholder="请输入关键字搜索" style="width: auto"/>
            <Button type="primary" :size="large">保存</Button>
        </div> -->
        <div class="book-store-search flex">
            <div class="book-store-btns">          
                <Button type="primary" :size="large"  @click="addBook">添加</Button>
            </div>
        </div>
        <div class="book-store-tab" style="margin-top:40px">
            <Table border ref="selection" :columns="columns" :data="data"></Table>
        </div>
        <Modal
            v-model="deletModel"
            title="删除书籍"
            width="50%"
            @on-ok="deletOk">
            <div class="chapter-cont">
                <p style="width:100%">是否从列表中是否删除该书籍？</p>
            </div>
        </Modal>
    </div>
</template>
<script>
    import {wordsNum,chapters,status,onShelfs,channel} from '../const-data/list-key.js'

    export default {
        created () {
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
                    this.getBookList()
                }, 100);
            })
            Promise.all([promise1,promise2,promise3])
        },
        data () {
            return {
                deletModel:false,
                bookIds:'',
                searchKey:'',//搜索关键字
                large: 'large',
                selectArr:[], // 选中的书籍
                comefrom: [], //来源
                classification: [], //分类
                status: status, //状态
                onShelfs: onShelfs, //上架
                channel: channel, //频道
                columns: [
                    {
                        title: '书籍id',
                        key: 'bookId',
                        align: 'center'
                    },
                    {
                        title: '书名',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '频道',
                        key: 'channel',
                        align: 'center'
                    },
                    {
                        title: '分类',
                        key: 'category',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'over',
                        align: 'center'
                    },
                    {
                        title: '来源',
                        key: 'source',
                        align: 'center'
                    },
                    {
                        title: '上架状态',
                        key: 'status',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    style: {
                                        color: '#169BD5',
                                        marginRight: '30px'
                                    },
                                    on: {
                                        click: () => {
                                            sessionStorage.setItem('hotsubtitle','更换')
                                            sessionStorage.setItem('hotbookId',JSON.stringify(params.row.bookId))
                                            this.$router.push('/HotChange')
                                        }
                                    }
                                }, '更换'),
                                h('a', {
                                    style: {
                                        color: '#169BD5'
                                    },
                                    on: {
                                        click: () => {
                                            this.bookId = params.row.bookId
                                            this.deletModel = true
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    },
                ],
                data: [],
            }   
        },
        methods: {
            // searchFun () {
            //     this.pageSize = 10
            //     this.page = 0
            //     this.getBookList()
            // },
            addBook () { // 添加书籍
                sessionStorage.setItem('hotsubtitle','添加')
                this.$router.push('/HotChange')
            },
            deletOk () {
                let param = new FormData(); //创建form对象
                param.append('bookIds',this.bookId)  
                let config = {  //添加请求头
                    headers:{'Content-Type':'multipart/form-data'}
                };
                this.$axios.post(this.URL + 'adminUserAuth/bookstore/delHotRecomBook',param,config).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.$Message.success('删除书籍成功!')
                        this.getBookList()
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    this.$Message.warning('删除书籍失败!');
                })
            },
            getBookList () {
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/getHotRecomBooks').then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.data = result.data
                        this.data.forEach((item,index) => {
                            item.channel = item.channel?'男频':'女频'
                            item.over = item.over?'完结':'连载中'
                            item.status = item.status?'已上架':'未上架'
                            this.comefrom.forEach(com => {
                                if (item.source == com.id) {
                                    item.source = com.name
                                }
                            })
                            this.classification.forEach(cla => {
                                if (item.category == cla.id) {
                                    item.category = cla.name
                                }
                            })
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
