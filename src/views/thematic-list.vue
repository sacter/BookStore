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
            <h2>专题列表</h2>
        </div>
        <div class="book-store-tab">
            <div>
                <h2 style="margin-bottom:10px">男频</h2>
                <Table border ref="selection" :columns="columns1" :data="data1"></Table>
            </div>
            <div style="margin-top:40px;">
                <h2 style="margin-bottom:10px">女频</h2>
                <Table border ref="selection" :columns="columns2" :data="data2"></Table>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                delet: false,
                themeId:'',
                columns1: [
                    {
                        title: '序号',
                        key: 'lable',
                        align: 'center'
                    },
                    {
                        title: '标题',
                        key: 'value',
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
                                    },
                                    on: {
                                        click: () => {
                                            sessionStorage.setItem('theme',JSON.stringify(params.row))
                                            this.$router.push('/ThematicSee')
                                        }
                                    }
                                }, '查看'),
                            ])
                        }
                    },
                ],
                columns2: [
                    {
                        title: '序号',
                        key: 'lable',
                        align: 'center'
                    },
                    {
                        title: '标题',
                        key: 'value',
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
                                    },
                                    on: {
                                        click: () => {
                                            sessionStorage.setItem('theme',JSON.stringify(params.row))
                                            this.$router.push('/ThematicSee')
                                        }
                                    }
                                }, '查看'),
                            ])
                        }
                    },
                ],
                data1: [],
                data2: [],
            }
        },
        mounted() {
            this.getBookList()
        },
        methods: {
            getBookList () { // 获取专题列表
                this.$axios.get(this.URL + 'adminUserAuth/bookstore/specialList').then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.data1 = result.data.man
                        this.data2 = result.data.woman
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
