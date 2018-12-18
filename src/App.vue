<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #fff;
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-group-title{
    text-align: left;
    padding-left: 0px;
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item,.ivu-menu-vertical .ivu-menu-submenu-title{
    text-align: left;
}
.ivu-spin-fullscreen-wrapper{
    margin-left: 200px;
}
.ivu-btn>.ivu-icon+span{
    margin-left: 0;
}
.flex{
    display: flex;
}
.justify{
    justify-content: space-between;
}
.flex-wrap {
    flex-wrap: wrap;
}
.flex-1 {
    flex: 1;
}
ul,li{
    list-style: none !important;
}

.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-header-bar{
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
}
.menu-title{
    width:100%;
    line-height: 60px;
    background-color: rgba(111, 204, 243, 1);
    font-size: 18px;
    color: #FFFFFF;
    font-weight:400;
}
.ivu-layout-header{
    height: 60px;
    border-bottom:1px solid rgba(204, 204, 204, 1);
}
.ivu-layout-content{
    background:#fff;
    width:100%;
    height: 100%;
    padding:0 16px;
}
.layout{
    border: 0;
    background: #fff;
    border-radius: 0;
}
</style>
<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
    export default {
      name: 'App',
      data () {
          return {
          }
      }
    }
</script>
