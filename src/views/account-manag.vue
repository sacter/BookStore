<template>
    <div class="book-store">
        <div class="comp-title flex justify">
            <h2>账号管理</h2>
        </div>
        <div class="book-store-search flex">
            <Input search enter-button v-model="searchKey" @on-search="searchFun" placeholder="请输入关键字搜索" style="width: auto"/>
            <div class="book-store-btns flex">
                <Button type="primary" :size="large" @click="creat">新建账号</Button>
            </div>
        </div>
        <div class="book-store-tab">
            <Table border ref="selection" :columns="columns" :data="data"></Table>
            <Page :total="totalElements" show-total transfer placement="bottom" @on-change="changePage" @on-page-size-change="changeSize" show-elevator show-sizer/>
        </div>
    </div>
</template>
<script>
    import { getDate }  from '../util/set-date-time.js';

    export default {
        created () {
            this.getBookList()
        },
        data () {
            return {
                pageNum:0, // 当前第几页
                pageSize:10, // 每页显示几条
                totalElements:10, // 总记条数
                searchKey:'',//搜索关键字
                large: 'large',
                searchKey:'',
                columns: [
                    {
                        title: '账号',
                        key: 'userName',
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'avatar',
                        align: 'center'
                    },
                    {
                        title: '角色',
                        key: 'account',
                        align: 'center'
                    },
                    {
                        title: '添加时间',
                        key: 'createdAt',
                        align: 'center'
                    },
                    {
                        title: '最后登录',
                        key: 'updatedAt',
                        align: 'center'
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
                                        'on-change': (value, param) => {//触发事件是on-change,用双引号括起来，
                                            let status = value?1:0
                                            this.changeUserStatus(params.row.id,status)
                                        }
                                    }
                                }, )
                            ])
                        }
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
                                            this.$router.push('/AccountChange')
                                            sessionStorage.setItem('Usertype','edit')
                                            sessionStorage.setItem('UserDetail',JSON.stringify(params.row))
                                        }
                                    }
                                }, '编辑')
                            ])
                        }
                    }
                ],
                data: [],
            }   
        },
        methods: {
            searchFun () {
                this.pageSize = 10
                this.page = 0
                this.getBookList()
            },
            changePage (p) {
                this.pageNum = p > 0 ? p - 1 : 0
                this.getBookList()
            },
            changeSize (s) {
                this.pageSize = s
                this.getBookList()         
            },
            creat () {
                this.$router.push('/AccountChange')
                sessionStorage.setItem('Usertype','add')
            },
            getBookList () {
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/getAdminUserList',{params:{
                    search:this.searchKey,
                    pageSize:this.pageSize,
                    pageNum:this.pageNum
                }}).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.data = result.data.content
                        this.totalElements = result.data.totalElements
                        this.data.forEach((item,index) => {
                            item.num = index + 1
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
            changeUserStatus (userId,enable) {//启禁用用户信息
                let param = new FormData(); //创建form对象
                param.append('id',userId)
                param.append('enable',enable)
                let config = {  //添加请求头
                    headers:{'Content-Type':'multipart/form-data'}
                };
                this.$axios.post(this.URL + 'adminUserAuth/bookstore/enableAdminUser',param,config).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.$Message.success('启禁用用户成功!')
                        this.getBookList()
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    this.$Message.warning('启禁用用户失败!');
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
