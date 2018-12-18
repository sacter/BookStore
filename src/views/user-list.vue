<template>
    <div class="book-store">
        <div class="comp-title flex justify">
            <h2>用户列表</h2>
        </div>
        <div class="book-store-search flex">
            <Input search enter-button v-model="searchKey" @on-search="searchFun" placeholder="请输入关键字搜索" style="width: auto"/>
        </div>
        <div class="book-store-tab">
            <Table border ref="selection" :columns="columns" :data="data"></Table>
            <Page :total="totalElements" show-total transfer placement="bottom" @on-change="changePage" @on-page-size-change="changeSize" show-elevator show-sizer/>
        </div>
    </div>
</template>
<script>
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
                        title: '用户id',
                        key: 'id',
                        align: 'center'
                    },
                    {
                        title: '用户账号',
                        key: 'phone',
                        align: 'center'
                    },
                    {
                        title: 'openID',
                        key: 'openId',
                        align: 'center'
                    },
                    {
                        title: '用户昵称',
                        key: 'nickName',
                        align: 'center'
                    },
                    {
                        title: '消费金额',
                        key: 'money',
                        align: 'center'
                    },
                    {
                        title: '订单数量',
                        key: 'orderCount',
                        align: 'center'
                    },
                    {
                        title: '可用书币',
                        key: 'coin',
                        align: 'center'
                    },
                    {
                        title: '账户状态',
                        key:'type',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('i-switch', { //数据库1是已处理，0是未处理
                                    props: {
                                        type: 'primary',
                                        value: params.row.type === 1  //控制开关的打开或关闭状态，官网文档属性是value
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
            getBookList () {
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/userList',{params:{
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
                            item.phone = item.phone?item.phone:'暂无数据'
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
                param.append('userId',userId)
                param.append('enable',enable)
                let config = {  //添加请求头
                    headers:{'Content-Type':'multipart/form-data'}
                };
                this.$axios.post(this.URL + 'adminUserAuth/bookstore/enableUser',param,config).then(res =>{
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
