<style>
    #editor{
        width: 1000px;
        height: 600px;
        max-height: 600px;
    }
    .add-chapter-top{
        margin: 20px 0;
        width: 1000px;
        justify-content: space-between;
    }
</style>

<template>
　　<div>
　　　　<!--editor的div为富文本的承载容器-->
        <div class="flex add-chapter-top">
            <div class="flex">
                <p style="width:100px;line-height: 30px;font-size: 14px;">章节名称：</p>
                <Input style="width:600px;" v-model="chapter.chapterName" placeholder="请输入章节名称"/>
            </div>
            <div>
                <Button type="primary" @click="chapterOk()" v-if="this.type !== 'see'">{{subTitle}}</Button>
                <Button type="primary" icon="ios-arrow-back" :size="large" @click="goBack">返回</Button>
            </div>
        </div>
　　    <div id="editor"></div>
　　</div>
</template>
<script>
export default {
    data () {
        return {
            editor: null,
            large:'large',
            type:'add',
            chapterId:'',
            subTitle:'',
            chapter: { // 新增、修改章节
                chapterName:'',
                content:'',
                chapterId:'',
                bookId:''
            },
        }
    },
    mounted () {
        this.type = sessionStorage.getItem('chatotType')
        this.chapter.chapterId = sessionStorage.getItem('chapterId')
        this.chapter.bookId = sessionStorage.getItem('bookId')
        if (this.type === 'add') {
            this.subTitle = '上传到待发布列表'
        } else if (this.type === 'edit') {
            this.getCharterCont (this.chapter.chapterId,true)
            this.subTitle = '修 改'
        } else {
            this.getCharterCont (this.chapter.chapterId,false)
        }
　　　　 this.editor = UE.getEditor('editor');  // 实例化editor编辑器
        // setTimeout(() => {
        //   this.editor.setContent('<p>new text似懂非懂<br/></p><p>上的发送到</p>', true); //插入的结果是<p>old text</p><p>new text</p> 
        // }, 100);
    },
    destroyed() {// 将editor进行销毁
    　　this.editor.destroy();
    },
    methods: {
        goBack () {
            this.$router.go(-1)
        },
        chapterOk () {  // 新增、修改章节  
                console.log(this.editor.getContent())
            this.chapter.content = this.editor.getContent()
            if (!this.chapter.chapterName) {
                this.$Message.warning('章节名称不能为空!')
                return
            }
            if (!this.chapter.content) {
                this.$Message.warning('章节正文不能为空!')
                return
            }
            let param = new FormData(); //创建form对象
            for (let item in this.chapter) {
                param.append(item,this.chapter[item])
            }
            let config = {  //添加请求头
                headers:{'Content-Type':'multipart/form-data'}
            };
            if (this.type === 'add') { // 新增 
                this.$axios.post(this.URL + 'adminUserAuth/bookstore/addChapter',param,config).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.$Message.success('新增章节成功!');
                        this.$router.push('/BookDetail')
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    this.$Message.warning('新增章节失败!');
                })
            } else { // 修改
                this.$axios.post(this.URL + 'adminUserAuth/bookstore/updateChapter',param,config).then(res =>{
                    let result = res.data
                    if (result.code == 200) {
                        this.$Message.success('修改章节成功!')
                        this.$router.push('/BookDetail')
                    }
                    if (result.errorCode == 90002) {
                        this.$router.push('/')
                    }
                }).catch(err => {
                    this.$Message.warning('新增章节失败!');
                })
            }
        },
        getCharterCont (chapterId, canEdit) { // 获取章节内容
            this.$axios.get(this.URL + 'adminUserAuth/bookstore/getChapterContent',{
                params:{
                    chapterId:chapterId,
                }
            }).then(res =>{
                let result = res.data
                if (result.code == 200) {
                    this.chapter.chapterName = result.data.chapterName
                    this.chapter.content = result.data.content
                    this.editor.setContent(result.data.content)
                    if (!canEdit) {
                        this.editor.setDisabled()
                    }
                }else{
                    this.chapter.content = ''
                    this.$Message.warning('获取章节内容失败!')
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