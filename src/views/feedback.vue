<template>
    <div class="book-store">
        <div class="comp-title flex justify">
            <h2>意见反馈</h2>
        </div>
        <div class="book-store-search flex">
            <Select v-model="typeKey" style="width:200px" @on-change="change">
                <Option v-for="item in typeKeyList" :value="item.key" :key="item.key">{{ item.value }}</Option>
            </Select>
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
            this.$axios.get(this.URL + 'adminUserAuth/bookstore/getQuestionType').then(res =>{
                let result = res.data
                if (result.code == 200) {
                    this.typeKeyList = result.data
                } 
            })
            if (result.errorCode == 90002) {
                this.$router.push('/')
            }
            this.getBookList()
        },
        data () {
            return {
                pageNum:0, // 当前第几页
                pageSize:10, // 每页显示几条
                totalElements:10, // 总记条数
                searchKey:'',//搜索关键字
                typeKey:'',
                large: 'large',
                searchKey:'',
                typeKeyList:[],
                columns: [
                    {
                        title: '编号',
                        key: 'num',
                        align: 'center'
                    },
                    {
                        title: '问题类型',
                        key: 'typeValue',
                        align: 'center'
                    },
                    {
                        title: '问题内容',
                        key: 'detaileDesc',
                        align: 'center'
                    },
                    {
                        title: '联系方式',
                        key: 'phone',
                        align: 'center'
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
            change () {
                this.getBookList()
            },
            getBookList () {
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/getQuestionList',{params:{
                    search:this.searchKey,
                    pageSize:this.pageSize,
                    typeKey:this.typeKey,
                    pageNum:this.pageNum
                }}).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.totalElements = result.data.totalElements
                        this.data = result.data.content
                        this.data.forEach((item,index) => {
                            item.num = index + 1
                        })
                    } 
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
        }
    }
</script>
