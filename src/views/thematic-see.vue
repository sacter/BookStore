<style scoped>
    .theme-list-sel{
        margin: 20px 0 10px 0;
    }
    .theme-list-sel p{
        font-size: 14px;
        line-height: 32px;
    }
</style>
<template>
    <div class="book-store">
        <div class="comp-title flex justify">
            <h2>{{theme.value}}</h2>
            <Button type="primary" icon="ios-arrow-back" :size="large" @click="goBack">返回</Button>
        </div>
        <div class="theme-list-sel flex justify">
            <div></div>
            <div>
                <Button type="primary" :size="large" style="margin-right:16px" @click="delet">删除</Button>
                <Button type="primary" :size="large" @click="addBook">添加</Button>
            </div>
        </div>
        <div class="book-store-tab">
            <Table border ref="selection" :columns="columns" :data="data" @on-select="tabSel" @on-select-all="tabSel" @on-selection-change="tabSel"></Table>
        </div>
        <Modal
            v-model="deletModel"
            title="删除章节"
            width="50%"
            @on-ok="deletOk">
            <div class="chapter-cont">
                <p style="width:100%">是否从{{theme.value}}列表中是否删除该书籍？</p>
            </div>
        </Modal>
    </div>
</template>
<script>
    import {wordsNum,chapters,status,onShelfs,channel} from '../const-data/list-key.js'

    export default {
        mounted () {
            this.theme = JSON.parse(sessionStorage.getItem('theme'))
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
                    this.getThemeData()
                }, 100);
            })
            Promise.all([promise1,promise2,promise3])
        },
        data () {
            return {
                deletModel:false,
                theme:{},
                large: 'large',
                free: '1天',
                selectArr:[], // 选中的书籍
                comefrom: [], //来源
                classification: [], //分类
                status: status, //状态
                onShelfs: onShelfs, //上架
                channel: channel, //频道
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
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
                                        color: '#169BD5'
                                    },
                                    on: {
                                        click: () => {
                                            this.theme.subtitle = '更换'
                                            sessionStorage.setItem('theme',JSON.stringify(this.theme))
                                            sessionStorage.setItem('themebookId',JSON.stringify(params.row.bookId))
                                            this.$router.push('/ThematicChange')
                                        }
                                    }
                                }, '更换')
                            ])
                        }
                    },
                ],
                data: [],
                freeList: [
                    {
                        value: 'f1',
                        label: '1天'
                    },
                    {
                        value: 'f2',
                        label: '5天'
                    },
                    {
                        value: 'f3',
                        label: '1周'
                    },
                    {
                        value: 'f4',
                        label: '1个月'
                    },
                ]
            }
        },
        methods: {
            goBack () {
                this.$router.go(-1)
            },
            tabSel (val) {
                this.selectArr = val;
            },
            delet () {  // 删除书籍
                if (!this.selectArr.length) {
                    this.$Message.warning('请选择要删除的书籍!');
                    return;
                }
                this.deletModel = true
            },
            addBook () { // 添加书籍
                this.theme.subtitle = '添加'
                sessionStorage.setItem('theme',JSON.stringify(this.theme))
                this.$router.push('/ThematicChange')
            },
            deletOk () {
                let bookIds = []
                this.selectArr.forEach(item => {
                    bookIds.push(item.bookId)
                })
                let param = new FormData(); //创建form对象
                param.append('bookIds',bookIds.toString())
                param.append('lable',this.theme.lable)    
                let config = {  //添加请求头
                    headers:{'Content-Type':'multipart/form-data'}
                };
                this.$axios.post(this.URL + 'adminUserAuth/bookstore/delSpecialBook',param,config).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.$Message.success('书籍删除成功!')
                        this.getThemeData()
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    this.$Message.warning('书籍删除失败!');
                })
            },
            getThemeData () { // 获取专题内容
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/getSpecialBooks',{params:{lable:this.theme.lable}}).then(res =>{
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
