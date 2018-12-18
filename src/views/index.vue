<style>

</style>
<template>
    <div>
        <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
            <h2 class="menu-title">掌上阅读管理后台</h2>
            <Menu :active-name="selectMenu" accordion theme="dark" width="auto" :open-names="[4]" @on-select="select">
                <Submenu v-for="item of menus" :key="item.name" :name="item.name">
                    <template slot="title">
                        <Icon type="ios-keypad"></Icon>
                        {{item.title}}
                    </template>
                    <div v-for="(child,index) of item.children" :key="index">
                        <MenuGroup :title="child.stitle" v-if="child.stitle">
                            <div v-for="t of child.three" :key="t.name">
                                <router-link :to="t.path">
                                    <MenuItem :name="t.name">{{t.title}}</MenuItem>
                                </router-link>
                            </div>
                        </MenuGroup>
                        <router-link :to="child.path" v-if="!child.stitle">
                            <MenuItem :name="child.name">{{child.title}}</MenuItem>
                        </router-link>
                    </div>
                </Submenu>
            </Menu>
        </Sider>
        <Layout :style="{marginLeft: '200px'}">
            <Header :style="{background: '#fff'}">
                <Dropdown style="position: absolute;right: 16px;font-size: 20px;" trigger="click">
                    <a href="javascript:void(0)">
                        <Icon type="md-person" style="color: rgb(22, 155, 213);"/>
                        <span style="color:#333;font-size: 14px;">{{loginName}}</span>
                        <Icon type="md-arrow-dropdown" style="color: rgb(22, 155, 213);font-size: 24px;"/>
                    </a>
                    <Dropdown-menu slot="list" style="top:50px;">
                        <Dropdown-item>
                            <Button type="text" @click="loginout"><Icon type="md-contact"/>&ensp;退出</Button>
                        </Dropdown-item>
                    </Dropdown-menu>
                </Dropdown>
            </Header>
            <Content>
                  <router-view/>
            </Content>
        </Layout>
    </div>
</template>
<script>
    import {menus} from '../const-data/menu-data.js'
    export default {
        created () { 
            this.loginName = localStorage.getItem('loginName') 
        },
        data () {
            return {
                selectMenu: '4-1',
                loginName:'',
                menus:menus
            }
        },
        methods: {
            select (m) {
                sessionStorage.setItem('selectMenu',m)
            },
            loginout () {
                this.$axios.post(this.URL + 'adminUserAuth/backstage/loginout').then(res => {
                    if (res.data.code == 200) {
                        this.$router.push('/')
                    }
                })
                .catch(err => {
                    this.$Message.warning('退出登录失败!');
                })
            }
        }
    }
</script>
