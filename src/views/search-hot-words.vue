<template>
    <div class="book-store">
        <div class="comp-title flex justify">
            <h2>搜索热词</h2>
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
                        title: '序号',
                        key: 'num',
                        align: 'center'
                    },
                    {
                        title: '热词',
                        key: 'word',
                        align: 'center'
                    },
                    {
                        title: '次数',
                        key: 'searchCount',
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
            getBookList () {
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/hotWordList',{params:{
                    search:this.searchKey,
                    pageSize:this.pageSize,
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
