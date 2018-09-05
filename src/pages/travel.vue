<!-- 游记 -->
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>游记列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-button type="primary" plain @click="addSchool">添加游记</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="created_at" label="创建时间"></el-table-column>
                <el-table-column prop="title" label="图文标题"></el-table-column>
                <el-table-column prop="introduction" label="游记简介"></el-table-column>
                <el-table-column label="游记封面图">
                  <template slot-scope="props">
                    <img :src="props.row.cover" alt="" style="width:100px;height:auto;cursor:pointer;" @click="checkImage(props.row.cover)">
                  </template>
                </el-table-column>
                <el-table-column prop="link" label="链接"></el-table-column>
                <el-table-column label="操作">
                   <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div> -->
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="添加游记" :visible.sync="editVisible" width="500px">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="游记标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="游记链接">
                    <el-input v-model="form.link"></el-input>
                </el-form-item>
                <el-form-item label="游记简介">
                    <el-input type="textarea" autosize v-model="form.introduction"></el-input>
                </el-form-item>
            </el-form>
            <el-upload
              class="upload-demo"
              action="/api/admin/upload/img"
              :on-change="handleChangeMain"
              :on-remove="handleRemoveMain"
              name="img"
              multiple
              :limit="1"
              :headers="token"
              :file-list="fileList"
              list-type="picture">
              <el-button size="small" type="primary">上传游记图片</el-button>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">添加</el-button>
            </span>
        </el-dialog>

         <!-- 编辑弹出框 -->
        <el-dialog title="添加客房" :visible.sync="editRoomVisible" width="500px">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoomVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import { apiTravelListAdd,apiTravelList,apiTravelListDelete } from '@/service/index'
    export default {
        data() {
            return {
                fileList: [],
                tableData: [],
                cur_page: 1,
                pageSize: 10,
                total: 0,
                select_cate: '',
                select_word: '',
                is_search: false,
                editVisible: false,
                editRoomVisible: false,
                form: {
                    title: '',
                    link: '',
                    introduction: ''
                },
                deleteId: ''
            }
        },
        created() {
            this.getData();
        },
        computed: {
           token(){
             return {
               Authorization: `bearer ${localStorage.getItem('admin-token')}`
             }
           }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            handleRemoveMain(file, fileList) {
                this.fileList = fileList
            },
            handleChangeMain(file, fileList){
              this.fileList = fileList
            },
            checkImage(url){
              window.open(url)
            },
            getData() {
                const self = this
                apiTravelList({
                  page: this.cur_page
                })
                .then((res) => {
                  console.log('res',res)
                  self.tableData = res.data.list
                  self.total = res.data.total
                })
            },
            handleEdit(){
              
            },
            handleDelete(row){
              this.deleteId = row.id
              this.$confirm('确定删除当前游记?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        this.deleteRow()
                      }).catch(() => {
                        this.$message({
                          type: 'info',
                          message: '已取消删除'
                        });          
                      })
            },
            addSchool(){
              this.editVisible = true
              this.form.title = ''
              this.form.link = ''
              this.form.introduction = ''
              this.fileList = []
            },
            search() {
                this.is_search = true;
            },
            // 添加游记
            saveEdit() {
              apiTravelListAdd({
                title: this.form.title,
                introduction: this.form.introduction,
                cover: this.fileList[0].response.data.url,
                link: this.form.link
              })
              .then((res)=>{
                if(res.code == 200){
                  this.editVisible = false
                  this.$message.success('添加成功')
                  this.getData()
                }else{
                  this.$message.error(res.message)
                }
              })
            },
            // 确定删除
            deleteRow(){
              apiTravelListDelete({
                id: this.deleteId
              })
              .then((res)=>{
                if(res.code == 200){
                  this.$message.success('删除成功')
                  this.getData()
                }else{
                  this.$message.error(res.message)
                }
              })
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
<style>
  .el-upload--text{
     border:none !important;
     text-align: left;
     margin-left: 10px;
     height:50px;
    }  
</style>
