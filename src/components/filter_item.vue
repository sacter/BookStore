<style scoped>
    .condition-item{
        padding:5px 10px;
        margin:0 4px;
        cursor: pointer;
        color: #777;
    }
    .condition-title{
        line-height: 28px;
        display: inline-block;
        color: #333333;
        font-size: 14px;
    }
    .condition-item.active{
        background-color: #169BD5;
        border-color: #169BD5;
        border-radius: 4px;
        color:#fff;
    }
    .collapse-items{
        height: 28px;
        overflow: hidden;
    }
    .container.flex{
        width: 100%;
    }
    .icon-margin {
        margin-left: 5px;
    }
    .button-text span {
        color: #169BD5;
    }
</style>
<template>
    <div class="container flex">
        <div><span class="condition-title">{{filterName}}：</span></div>
        <div class="flex-1 flex flex-wrap" ref="itemContainer" :class="{'collapse-items':isCollapse}">
            <span class="condition-item all" v-if="hasAll" :class="{'active':!filterCondition.length}" @click="chose(null)">全部</span>
            <span class="condition-item" v-for="item in filterData" :key="item.id" :class="{'active':filterCondition.includes(item.id)}" @click="chose(item)">{{ getName(item)}}</span>
        </div>
        <div v-if="showMore">
            <Button type="text" @click="collapseItem()" class="button-text">
                <span v-show="isCollapse">展开<Icon type="ios-arrow-down" size="18" class="icon-margin"/></span>
                <span v-show="!isCollapse">收起<Icon type="ios-arrow-up" size="18" class="icon-margin"/></span>
            </Button>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            fieldKey: {
                type: String,
                default: ''
            },
            filterName: {
                type: String,
                default () {
                    return '分类'
                }
            },
            filterData: {
                type: Array,
                default () {
                    return []
                }
            },
            hasAll: {
                type: Boolean,
                default () {
                    return true
                }
            },
            isMulti: {
                type: Boolean,
                default () {
                    return true
                }
            }
        },
        data () {
            return {
                isCollapse: true,
                filterCondition: [],
                showMore: false,
                init: true // 判断是否是首次init，如果是首次，则不触发事件
            }
        },
        mounted () {
            this.showMore = true
        },
        methods: {
            chose (i) {
                // i = null,则为全部
                if (i == null) {
                    this.filterCondition = []
                } else {
                    let index = this.filterCondition.indexOf(i.id)
                    if (index != -1) {
                        this.filterCondition.splice(index, 1)
                    } else {
                        if (!this.isMulti) {
                            this.filterCondition = []
                        }
                        this.filterCondition.push(i.id)
                    }
                }
                let temp = []
                for (let i = 0; i < this.filterData.length; i++) {
                    if (this.filterCondition.includes(this.filterData[i].id)) {
                        temp.push(this.filterData[i])
                    }
                }
                this.$emit('filterCondition-change', temp)
            },
            collapseItem () {
                this.isCollapse = !this.isCollapse
            },
            getName (v) {
                // 指定数据显示属性
                if (this.fieldKey && v[this.fieldKey]) {
                    return v[this.fieldKey]
                }
                return v.shortname || v.name || v.title || v.value
            }
        },
        updated () {
            let container = this.$refs.itemContainer
            // lineheight 指定32px
            let children = this.$('span', container)
            let childrenLength = 0
            children.each((index, dom) => {
                childrenLength += (dom.clientWidth + 20)
            })
            if (container.clientWidth < childrenLength) {
                this.showMore = true
            } else {
                this.showMore = false
            }
        },
        watch: {
            filterData (n, o) {
                // 增加初始化条件判断
                if (this.init) {
                    this.filterCondition = []
                    if (o.length) {
                        this.$emit('filterCondition-change', [])
                    }
                    this.init = false
                }
            }
        }
    }
</script>
