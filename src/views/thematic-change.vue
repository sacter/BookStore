<template>
    <div class="book-store">
        <div class="comp-title flex justify">
            <h2>{{this.theme.value}} | {{this.theme.subtitle}}</h2>
            <Button type="primary" icon="ios-arrow-back" :size="large" @click="goBack">返回</Button>
        </div>
        <div class="book-store-filter">
            <FilterItem class="filter-item"  :isMulti=false :filterData="comefrom" :filterName="'来源'" @filterCondition-change="bookSel($event,'comefrom')"></FilterItem>
            <FilterItem class="filter-item"  :isMulti=false :filterData="channel" :filterName="'分类'" @filterCondition-change="selectChannel"></FilterItem>
            <FilterItem class="filter-item classification"  :isMulti=false :filterData="classification" :filterName="'分类'" @filterCondition-change="bookSel($event,'classification')"></FilterItem>
            <FilterItem class="filter-item"  :isMulti=false :filterData="wordsNum" :filterName="'字数'" @filterCondition-change="bookSel($event,'wordsNum')"></FilterItem>
            <FilterItem class="filter-item"  :isMulti=false :filterData="chapters" :filterName="'章节'" @filterCondition-change="bookSel($event,'chapters')"></FilterItem>
            <FilterItem class="filter-item"  :isMulti=false :filterData="status" :filterName="'状态'" @filterCondition-change="bookSel($event,'status')"></FilterItem>
            <FilterItem class="filter-item"  :isMulti=false :filterData="onShelfs" :filterName="'上架'" @filterCondition-change="bookSel($event,'onShelfs')"></FilterItem>
        </div>
        <div class="book-store-search flex">
            <Input search enter-button v-model="bookListObj.search" @on-search="searchFun" placeholder="请输入关键字搜索" style="width: auto"/>
            <div class="book-store-btns flex" v-if="theme.subtitle === '添加'">          
                <Button type="primary" :size="large" @click="openModal1">添加</Button>
            </div>
        </div>
        <div class="book-store-tab">
            <Table border ref="selection" :columns="columns" :data="data" @on-select="tabSel" @on-select-cancel="tabDel" @on-select-all="tabAll" @on-selection-change="tabChange"></Table>
            <Page :total="totalElements" show-total transfer placement="bottom" @on-change="changePage" @on-page-size-change="changeSize" show-elevator show-sizer/>
        </div>
        <Modal
            v-model="bookChange"
            title="书籍"
            width="50%"
            @on-ok="changeOk">
            <div class="chapter-cont">
                <p style="width:100%">是否{{theme.subtitle}}书籍？</p>
            </div>
        </Modal>
    </div>
</template>
<script>
    import FilterItem from '@/components/filter_item.vue'
    import {wordsNum,chapters,status,onShelfs,channel} from '../const-data/list-key.js'

    export default {
        components: {FilterItem},
        created () {
            this.theme = JSON.parse(sessionStorage.getItem('theme'))
            this.oldBookId = sessionStorage.getItem('themebookId')
            this.columns = this.theme.subtitle === '添加'?this.columns1:this.columns2
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
                this.pageSize = 10
                this.page = 0
                setTimeout(() => {
                    this.getBookList()
                }, 100);
            })
            Promise.all([promise1,promise2,promise3])
        },
        data () {
            return {
                oldBookId:'', // 更换前书籍id
                newBookId:'',// 更换后书籍id
                theme:'',
                bookChange: false, // 修改定价modal
                large: 'large',
                totalElements:10, // 总记条数
                page:0, // 当前第几页
                pageSize:10, // 每页显示几条
                comefromKey:'', // 来源条件
                ficatKey:'', // 分类条件
                statusKey:'', //状态条件
                shelfKey:'', //上架条件
                selectArr:[], // 选中图书数组
                bookListObj: { // 书籍列表对象
                    search:'',
                    channel:'',
                    categoryId:'',
                    source:'',
                    end:'',
                    charge:'',
                    onShelf:'',
                    chapterNum:'',
                    wordNum:'',
                    pageSize:'',
                    pageNum:''
                }, 
                comefrom: [], //来源
                classification: [], //分类
                wordsNum: wordsNum, //字数
                chapters: chapters, //章节
                status: status, //状态
                onShelfs: onShelfs, //上架
                channel:channel, // 频道
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '书号',
                        key: 'bookNum',
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
                        title: '章节数',
                        key: 'chapterNum',
                        align: 'center'
                    },
                    {
                        title: '字数',
                        key: 'wordCount',
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
                                            sessionStorage.setItem('BookDetail-bookId',JSON.stringify(params.row.bookId))
                                            this.$router.push('/BookDetail')
                                        }
                                    }
                                }, '查看')
                            ])
                        }
                    }
                ],
                columns2: [
                    {
                        title: '书号',
                        key: 'bookNum',
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
                        title: '章节数',
                        key: 'chapterNum',
                        align: 'center'
                    },
                    {
                        title: '字数',
                        key: 'wordCount',
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
                                            this.newBookId = params.row.bookId
                                            this.bookChange = true
                                        }
                                    }
                                }, '更换')
                            ])
                        }
                    }
                ],
                data: [],
            }   
        },
        methods: {
            goBack () {
                this.$router.go(-1)
            },
            changePage (p) {
                this.page = p > 0 ? p - 1 : 0
                this.getBookList()
            },
            changeSize (s) {
                this.pageSize = s
                this.getBookList()           
            },
            bookSel(list, type) {
                if (type === 'comefrom') {
                    this.bookListObj.source = list[0]?list[0].id:''
                } else if (type === 'classification') {
                    this.bookListObj.categoryId = list[0]?list[0].id:''
                } else if (type === 'wordsNum') {
                    this.bookListObj.wordNum = list[0]?list[0].id:''
                } else if (type === 'chapters') {
                    this.bookListObj.chapterNum = list[0]?list[0].id:''
                } else if (type === 'status') {
                    this.bookListObj.end = list[0]?list[0].id:''
                } else if (type === 'onShelfs') {
                    this.bookListObj.onShelf = list[0]?list[0].id:''
                }
                this.getBookList()
            },
            selectChannel (s) { // 选择男频、女频
                let sex = ''
                this.bookListObj.channel = ''
                this.bookListObj.categoryId = ''
                if (s.length) {
                    sex = s[0].id
                    this.bookListObj.channel = s[0].id
                }
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/getCategory',{params:{sex:sex}}).then(res =>{
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
                this.pageSize = 10
                this.page = 0
                this.getBookList()
            },
            searchFun () {
                this.pageSize = 10
                this.page = 0
                this.getBookList()
            },
            tabSel (selection,row) {
                this.selectArr.push(row)
            },
            tabDel (selection,row) { // 删除
                this.selectArr.forEach((item,index) => {
                    if (item.bookId === row.bookId) {
                        this.selectArr.splice(index,1)
                    }
                })
            },
            tabChange  (selection) { // 全选删除
                let dataIds = this.getDataIds()
                if (!selection.length) {
                    dataIds.forEach(item => {
                        this.selectArr.forEach((ele,index) => {
                            if (ele.bookId === item) {
                                this.selectArr.splice(index,1)
                            }
                        })
                    })
                }
            },
            tabAll (selection) { // 全选
                let dataIds = this.getDataIds()
                dataIds.forEach(item => {
                    this.selectArr.forEach((ele,index) => {
                        if (ele.bookId === item) {
                            this.selectArr.splice(index,1)
                        }
                    })
                })
                this.selectArr = this.selectArr.concat(this.data)
            },
            getDataIds () {
                let arr = []
                this.data.forEach(item => {
                    arr.push(item.bookId)
                })
                return arr
            },
            openModal1 () {
                if (!this.selectArr.length) {
                    this.$Message.warning('请选择书籍!');
                    return;
                }
                this.bookChange = true
            },
            changeOk () { // 添加或更换书籍
                let bookIds = []
                this.selectArr.forEach(item => {
                    bookIds.push(item.bookId)
                })
                let param = new FormData(); //创建form对象
                let config = {  //添加请求头
                    headers:{'Content-Type':'multipart/form-data'}
                };
                if (this.theme.subtitle === '添加') {
                    param.append('bookIds',bookIds.toString())
                    param.append('lable',this.theme.lable)    
                    this.$axios.post(this.URL + 'adminUserAuth/bookstore/addSpecialBooks',param,config).then(res =>{
                        let result = res.data
                        if (result.code == 200) {
                            this.$Message.success('书籍添加成功!')
                            this.$router.push('/ThematicSee')
                        }
                        if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                    }).catch(err => {
                        this.$Message.warning('书籍添加失败!');
                    })
                } else {
                    param.append('oldBookId',this.oldBookId)
                    param.append('newBookId',this.newBookId)
                    param.append('lable',this.theme.lable)                    
                    this.$axios.post(this.URL + 'adminUserAuth/bookstore/updateSpecialBook',param,config).then(res =>{
                        let result = res.data
                        if (result.code == 200) {
                            this.$Message.success('书籍更换成功!')
                            this.$router.push('/ThematicSee')
                        }
                        if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                    }).catch(err => {
                        this.$Message.warning('书籍更换失败!');
                    })
                }   
            },
            getBookList () {
                this.bookListObj.pageSize = this.pageSize
                this.bookListObj.pageNum = this.page
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/bookList',{params:this.bookListObj}).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.data = result.data.content
                        this.totalElements = result.data.totalElements
                        this.data.forEach((item,index) => {
                            item.newfee = item.fee
                            item.newfeeChapter = item.feeChapter
                            item.bookNum = this.page * this.pageSize + index + 1
                            item.channel = item.channel?'男频':'女频'
                            item.over = item.over?'完结':'连载中'
                            item.status = item.status?'已上架':'未上架'
                            this.selectArr.forEach(sel => {
                                if (item.bookId === sel.bookId) {
                                    item._checked = true
                                }
                            });
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
