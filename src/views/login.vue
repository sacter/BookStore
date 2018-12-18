<style>
    .login{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .loginCon{
        position: absolute;
        top: 300px;
        left: 60%;
        margin: auto;
        width: 300px;
    }
    .loginCon .ivu-input-group-prepend{
        width: 60px;
    }
    .loginCon .ivu-input-wrapper{
        margin-top: 12px;
    }
    .loginCon p{
        text-align: right;
        margin: 6px 0 10px 0;
    }
</style>
<template>
    <div class="login">
        <div class="loginCon">
            <h2>登录</h2>
            <Input v-model="user.loginName">
                <span slot="prepend">用户名</span>
            </Input>
            <Input type="password" v-model="user.password">
                <span slot="prepend">密码</span>
            </Input>
            <p>忘记密码请联系管理员</p>
            <Button type="primary" @click="login">登录</Button>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return{
                user:{
                    loginName:'', //咖布, HaiMaQingFan321
                    password:'' 
                }
            }
        },
        methods: {
            login () {
                if (window.location.host == 'csbookmgr.iserious.cn') {
                    this.URL = 'http://csm.api.iserious.cn/'
                } else {
                    this.URL = 'http://m.api.iserious.cn/'
                }             
                let param = new FormData(); //创建form对象
                param.append('loginName',this.user.loginName);
                param.append('password',this.user.password);
                let config = {  //添加请求头
                    headers:{'Content-Type':'multipart/form-data'}
                };
                this.$axios.post(this.URL + 'adminUser/backstage/login',param,config).then(res => {
                    let result = res.data
                    if (result.errorCode === 10001) {
                        this.$Message.warning(res.data.errorMsg)
                        return
                    }
                    if (result.code == 200) {
                        localStorage.setItem('userToken', result.data.accessToken)
                        localStorage.setItem('loginName', result.data.loginName)
                        this.$router.push('/Index')
                    } 
                })
                .catch(err => {
                    console.log(err);
                })
            }
        }
    }
</script>
