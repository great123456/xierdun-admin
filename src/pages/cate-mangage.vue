<!-- 菜品管理 -->
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>菜品管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-select v-model="cateId" placeholder="请选择菜谱" @change="selectCook">
                  <el-option
                    v-for="item in cateList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
              </el-select>
              <el-button type="primary" plain @click="addSchool">添加菜品</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="name" label="菜品名称"></el-table-column>
                <el-table-column prop="price" label="菜品价格"></el-table-column>
                <!-- <el-table-column prop="created_ata" label="使用时间"></el-table-column>
                <el-table-column prop="created_ata" label="有效期"></el-table-column>
                <el-table-column prop="created_ata" label="菜品简介"></el-table-column> -->
                <el-table-column label="封面图">
                  <template slot-scope="props">
                    <img :src="props.row.img" alt="" style="width:100px;height:auto;cursor:pointer;" @click="checkImage(props.row.img)">
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                   <template slot-scope="scope">
                      <el-button
                         size="mini"
                         type="primary"
                         @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                      <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 添加菜品 -->
        <el-dialog title="添加菜品" :visible.sync="editVisible" width="500px">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="菜品名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="菜品价格">
                    <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="使用时间">
                    <el-time-picker
                        v-model="form.time1"
                        value-format="HH:mm:ss"
                        placeholder="选择开始时间">
                    </el-time-picker>
                    <el-time-picker
                        style="margin-top:20px;"
                        v-model="form.time2"
                        value-format="HH:mm:ss"
                        placeholder="选择结束时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="结束日期">
                    <el-date-picker
                          v-model="form.date"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="菜品简介">
                    <el-input type="textarea" autosize v-model="form.desc"></el-input>
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
              <el-button size="small" type="primary">上传菜品图片</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">添加</el-button>
            </span>
        </el-dialog>
        

        <!-- 修改菜品 -->
        <el-dialog title="编辑菜品" :visible.sync="updateDialog" width="500px">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="菜品名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="菜品价格">
                    <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="使用时间">
                    <el-time-picker
                        v-model="form.time1"
                        value-format="HH:mm:ss"
                        placeholder="选择开始时间">
                    </el-time-picker>
                    <el-time-picker
                        style="margin-top:20px;"
                        v-model="form.time2"
                        value-format="HH:mm:ss"
                        placeholder="选择结束时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="结束日期">
                    <el-date-picker
                          v-model="form.date"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="菜品简介">
                    <el-input type="textarea" autosize v-model="form.desc"></el-input>
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
              <el-button size="small" type="primary">上传菜品图片</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateMenu">修改</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
    import { apiCookbookList,apiMenuListAdd,apiMenuList,apiMenuListDelete,apiMenuListSave,apiMenuListDetail} from '@/service/index'
    export default {
        data() {
            return {
                cateList: [],
                cateId: '',
                fileList: [],
                tableData: [],
                cur_page: 1,
                pageSize: 10,
                total: 0,
                select_cate: '',
                select_word: '',
                is_search: false,
                editVisible: false,
                updateDialog: false,
                form: {
                    name: '',
                    price: '',
                    date: '',
                    time1: '',
                    time2:'',
                    desc: ''
                },
                deleteId: '',
                updateId: ''
            }
        },
        created() {
            this.getCookList()
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
            getCookList(){
              apiCookbookList({
                page: this.cur_page
              })
              .then((res) => {
                  this.cateList = res.data.list
                  if(this.cateList.length>0){
                    this.cateId = this.cateList[0].id
                    this.getData()
                  }
              })
            },
            selectCook(){
              this.getData()
            },
            getData() {
                apiMenuList({
                  id: this.cateId,
                  page: 1
                })
                .then((res) => {
                    console.log('res',res.data)
                    this.tableData = res.data.list
                    this.total = res.data.total
                })
            },
            addSchool(){
              if(this.cateId == ''){
                this.$message('请先选择菜谱再添加菜品')
                return
              }
              this.editVisible = true
            },
            // 保存编辑
            saveEdit() {
              if(this.form.name == '' || this.form.time1 == '' || this.form.time2 == '' || this.form.date == ''){
                this.$message.error('信息填写完整再提交')
                return
              }
              if(this.fileList.price == '' || this.form.desc == ''){
                this.$message.error('信息填写完整再提交')
                return
              }
              if(this.fileList.length == 0){
                this.$message.error('菜品图片未上传')
                return
              }
              apiMenuListAdd({
                name: this.form.name,
                img: this.fileList[0].response.data.url,
                sort: 1,
                begin: this.form.time1,
                end: this.form.time2,
                before: this.form.date,
                price: this.form.price,
                cookbook_id: this.cateId,
                content: this.form.desc
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
            handleEdit(index,row){
              this.updateDialog = true
              this.updateId = row.id
              this.getMenuDetail(this.updateId)
            },
            getMenuDetail(id){
              apiMenuListDetail({
                id: id
              })
              .then((res)=>{
                if(res.code == 200){
                  this.form.name = res.data.name
                  this.form.price = res.data.price
                  this.form.desc = res.data.content
                  this.form.date = res.data.before
                  this.form.time1 = res.data.begin
                  this.form.time2 = res.data.end
                }
              })
            },
            updateMenu(){
              if(this.form.name == '' || this.form.time1 == '' || this.form.time2 == '' || this.form.date == ''){
                this.$message.error('信息填写完整再提交')
                return
              }
              if(this.fileList.price == '' || this.form.desc == ''){
                this.$message.error('信息填写完整再提交')
                return
              }
              if(this.fileList.length == 0){
                this.$message.error('菜品图片未上传')
                return
              }
              apiMenuListSave({
                id: this.updateId,
                name: this.form.name,
                img: this.fileList[0].response.data.url,
                sort: 1,
                begin: this.form.time1,
                end: this.form.time2,
                before: this.form.date,
                price: this.form.price,
                cookbook_id: this.cateId,
                conten: this.form.desc
              })
              .then((res)=>{
                if(res.code == 200){
                  this.updateDialog = false
                  this.$message.success('修改成功')
                  this.getData()
                }else{
                  this.$message.error(res.message)
                }
              })
            },
            handleDelete(row){
              this.deleteId = row.id
              this.$confirm('确定删除当前菜品?', '提示', {
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
            // 确定删除
            deleteRow(){
              apiMenuListDelete({
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
