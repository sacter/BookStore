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
            <h2>海报列表</h2>
        </div>
        <div class="theme-list-sel flex justify">
            <div></div>
            <div>
                <Button type="primary" :size="large" @click="addBook">添加</Button>
            </div>
        </div>
        <div class="book-store-tab">
            <Table border ref="selection" :columns="columns" :data="data" @on-select="tabSel" @on-select-all="tabSel" @on-selection-change="tabSel"></Table>
        </div>
        <Modal
            v-model="deletModel"
            title="删除广告"
            width="50%"
            @on-ok="deletOk">
            <div class="chapter-cont">
                <p style="width:100%">是否从列表中是否删除该广告？</p>
            </div>
        </Modal>
    </div>
</template>
<script>
    import {wordsNum,chapters,status,onShelfs,channel} from '../const-data/list-key.js'

    export default {
        mounted () {
            this.getThemeData()
        },
        data () {
            return {
                deletModel:false,
                large: 'large',
                adId:'',
                theme:{},
                columns: [
                    {
                        title: '编号',
                        key: 'num',
                        align: 'center'
                    },
                    {
                        title: '广告名称',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: '广告位置',
                        key: 'positions',
                        align: 'center'
                    },
                    {
                        title: '广告图片',
                        key: 'image',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                attrs: {
                                    style: 'width: 60px;height: 60px;margin:4px auto;'
                                },
                                }, [
                                    h('img', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        attrs: {
                                            src: params.row.image,
                                            alt:'暂无图片',
                                            style: 'width: 60px;height: 60px;border-radius: 2px;'
                                        },
                                        style: {
                                        },
                                    }),
                                ]);
                            }
                    },
                    {
                        title: '是否启用',
                        key:'status',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('i-switch', { //数据库1是已处理，0是未处理
                                    props: {
                                        type: 'primary',
                                        value: params.row.status === 1  //控制开关的打开或关闭状态，官网文档属性是value
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        'on-change': (value) => {//触发事件是on-change,用双引号括起来，
                                            let status = value?1:0
                                            this.toUse(params.row.id,status)
                                        }
                                    }
                                }, )
                            ])
                        }
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
                                            sessionStorage.setItem('mTitle','编辑')
                                            sessionStorage.setItem('advert',JSON.stringify(params.row))
                                            this.$router.push('/OperatAdvertising')
                                        }
                                    }
                                }, '编辑'),
                                h('a', {
                                    style: {
                                        color: '#169BD5'
                                    },
                                    on: {
                                        click: () => {
                                            this.adId = params.row.id
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
            tabSel (val) {
                this.selectArr = val;
            },
            addBook () { // 添加书籍
                sessionStorage.setItem('mTitle','添加')
                this.$router.push('/OperatAdvertising')
            },
            deletOk () {
                let param = new FormData(); //创建form对象
                param.append('ids',this.adId)  
                let config = {  //添加请求头
                    headers:{'Content-Type':'multipart/form-data'}
                };
                this.$axios.post(this.URL + 'adminUserAuth/bookstore/delPoster',param,config).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.$Message.success('删除广告成功!')
                        this.getThemeData()
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    this.$Message.warning('删除广告失败!');
                })
            },
            toUse (id,status) { // 启禁用广告
                let param = new FormData()
                param.append('id',id)
                param.append('status',status)    
                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                };
                this.$axios.post(this.URL + 'adminUserAuth/bookstore/enablePoster',param,config).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.$Message.success('启禁用广告成功!')
                        this.getThemeData()
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    this.$Message.warning('启禁用广告失败!');
                })
            },
            getThemeData () { // 获取专题内容
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/getPosterList').then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.data = result.data
                        this.data.forEach((item,index) => {
                            item.num = index + 1
                            item.positions = item.position?'男频':'女频'
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
