<style>
    .unloading .first-li .ivu-upload-drag,.unloading  .first-li .ivu-upload,.unloading img{
        width: 160px;
        height: 160px;
        border: 1px solid #dcdee2;
    }
    .unloading>ul,.unloading>ul>li>ul{
        width: 660px;
    }
    .unloading .up-img{
        line-height: 160px;
    }
    .unloading p{
        width: 70px;
        text-align: right;
        line-height: 31px;
    }
</style>
<style scoped>
    .unloading>ul>li{
        display: flex;
        margin-top:20px;
    }
    .unloading>ul>li>ul>li{
        display: flex;
        margin-right:20px;
    }
</style>
<template>
    <div class="unloading">
        <div class="comp-title flex justify">
            <h2>{{type==='add'?'新建':'编辑'}}账号</h2>
            <Button type="primary" icon="ios-arrow-back" :size="large" @click="goBack">返回</Button>
        </div>
        <Form ref="formValidate" :model="params" :rules="ruleValidate" :label-width="80">
            <ul>
                <FormItem prop="userName" v-if="type==='add'">
                    <li class="flex">
                        <p>账户名：</p>
                        <Input v-model="params.userName" placeholder="请输入账户名" style="width: 300px" />
                    </li>
                </FormItem>
                <FormItem prop="avatar">
                    <li class="flex">
                        <p>姓名：</p>
                        <Input v-model="params.avatar" placeholder="请输入姓名" style="width: 300px" />
                    </li>
                </FormItem>
                <FormItem prop="password">
                    <li class="flex">
                        <p>密码：</p>
                        <Input v-model="params.password" style="width: 300px" placeholder="请输入密码" />
                    </li>
                </FormItem>
            </ul>
        </Form>
        <Button type="primary" @click="submit" style="position:absolute;left:460px">保存</Button>
    </div>
</template>
<script>
    export default {
        created () {
            this.type = sessionStorage.getItem('Usertype')
            if (this.type !== 'add') {
                let obj = JSON.parse(sessionStorage.getItem('UserDetail'))
                this.params.avatar = obj.avatar
                this.params.userName = obj.userName
                this.params.id = obj.id
          }
        },
        data () {
            return {
                type:'',
                large:'large',
                ruleValidate: {
                    userName: [
                        { required: true, message: '账户名必填', trigger: 'blur'}
                    ],
                    avatar: [
                        { required: true, message: '姓名必填', trigger: 'blur'},
                    ],
                    password: [
                        { required: true, message: '密码必填', trigger: 'blur'}
                    ],
                },
                params:{
                    userName:'',
                    password:'',
                    avatar:''
                },
            }
        },
        methods: {
            goBack () {
                this.$router.go(-1)
            },
            submit () {             
                this.$refs.formValidate.validate((valid) => {
                    if (!valid) {
                        this.$Message.error('用户信息有误!')
                        return
                    } else {
                        let param = new FormData(); //创建form对象
                        for (let item in this.params) {
                            param.append(item,this.params[item])
                        }
                        let config = {  //添加请求头
                            headers:{'Content-Type':'multipart/form-data'}
                        };
                        if (this.type === 'add') {
                            this.$axios.post(this.URL + 'adminUserAuth/bookstore/addAdminUser',param,config).then(res =>{
                                let result = res.data
                                if (result.code == 200) {
                                    this.$Message.success('用户创建成功!');
                                    this.$router.push('/AccountManag')
                                }
                                if (result.errorCode == 90002) {
                                    this.$router.push('/')
                                }
                            }).catch(err => {
                                this.$Message.warning('用户创建成功!');
                            })
                        } else {
                            this.$axios.post(this.URL + 'adminUserAuth/bookstore/enableAdminUser',param,config).then(res =>{
                                let result = res.data
                                if (result.code == 200) {
                                    this.$Message.success('用户修改成功!');
                                    this.$router.push('/AccountManag')
                                }
                                if (result.errorCode == 90002) {
                                    this.$router.push('/')
                                }
                            }).catch(err => {
                                this.$Message.warning('用户修改成功!');
                            })
                        }
                    }
                })
            }
        }
    }
</script>
