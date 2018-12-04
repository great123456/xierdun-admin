<!-- 客房服务 -->
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>客房服务</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-button type="primary" plain @click="addSchool">添加客房</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="name" label="客房名称"></el-table-column>
                <el-table-column prop="room_number" label="客房数量"></el-table-column>
                <el-table-column prop="room_price" label="客房单价"></el-table-column>
                <el-table-column prop="start_at" label="开始时间"></el-table-column>
                <el-table-column prop="end_at" label="结束时间"></el-table-column>
                <el-table-column prop="roomStatus" label="是否满房"></el-table-column>
                <el-table-column label="客房图片">
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

        <!-- 添加服务 -->
        <el-dialog title="添加服务" :visible.sync="editVisible" width="500px">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="客房名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="客房数量">
                    <el-input v-model="form.room_number"></el-input>
                </el-form-item>
                <el-form-item label="客房单价">
                    <el-input v-model="form.room_price"></el-input>
                </el-form-item>
                <el-form-item label="是否满房">
                    <el-switch
                      v-model="form.room_status">
                    </el-switch>
                </el-form-item>
                <el-form-item label="开始日期">
                    <el-date-picker
                      v-model="form.start_at"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期">
                    <el-date-picker
                      v-model="form.end_at"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <el-upload
              class="upload-demo"
              action="/api/admin/upload/img"
              :on-change="handleChangeMain"
              :on-remove="handleRemoveMain"
              :on-success="handleUploadSuccess"
              name="img"
              multiple
              :limit="1"
              :headers="token"
              :file-list="fileList"
              list-type="picture">
              <el-button size="small" type="primary">上传服务图标</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改服务 -->
        <el-dialog title="修改服务" :visible.sync="updateDialog" width="500px">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="服务名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="客房数量">
                    <el-input v-model="form.room_number"></el-input>
                </el-form-item>
                <el-form-item label="客房单价">
                    <el-input v-model="form.room_price"></el-input>
                </el-form-item>
                <el-form-item label="是否满房">
                    <el-switch
                      v-model="form.room_status">
                    </el-switch>
                </el-form-item>
                <el-form-item label="开始日期">
                    <el-date-picker
                      v-model="form.start_at"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期">
                    <el-date-picker
                      v-model="form.end_at"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <el-upload
              class="upload-demo"
              action="/api/admin/upload/img"
              :on-change="handleChangeMain"
              :on-remove="handleRemoveMain"
              :on-success="handleUploadSuccess"
              name="img"
              multiple
              :limit="1"
              :headers="token"
              :file-list="fileList"
              list-type="picture">
              <el-button size="small" type="primary">上传客房图标</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateService">修改</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import { apiServiceList,apiServiceListAdd,apiServiceListDelete,apiServiceListSave } from '@/service/index'
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
                updateDialog: false,
                form: {
                    name: '',
                    room_number: '',
                    room_price: '',
                    room_status: false,
                    start_at: '',
                    end_at: ''
                },
                deleteId: '',
                updateId: ''
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
              console.log('file-list',fileList)
            },
            handleUploadSuccess(file, fileList){
              console.log('fie-success',fileList)
              this.fileList = []
              this.fileList.push({
                name: fileList.name,
                url: fileList.response.data.url
              })
            },
            checkImage(url){
              window.open(url)
            },
            getData() {
                apiServiceList({
                  page: this.cur_page
                })
                .then((res) => {
                    this.tableData = res.data.list
                    this.tableData.forEach((item) => {
                      item.roomStatus = item.room_status == 1 ? '有房' :'满房'
                    })
                    this.total = res.data.total
                })
            },
            search() {
                this.is_search = true;
            },
            addSchool(){
              this.editVisible = true
              this.form.name = ''
              this.form.room_number = ''
              this.form.room_price = ''
              this.fileList = []
            },
            // 添加服务
            saveEdit() {
              if(this.form.name == ''){
                this.$message.error('产品名称不能为空')
                return
              }
              if(this.fileList.length == 0){
                this.$message.error('服务图片未上传')
                return
              }
              apiServiceListAdd({
                name: this.form.name,
                img: this.fileList[0].url,
                sort: 1,
                room_number: this.form.room_number,
                room_price: this.form.room_price,
                room_status: this.form.room_status ? 2 : 1,
                start_at: this.form.start_at,
                end_at: this.form.end_at
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
              this.form.name = row.name
              this.form.room_number = row.room_number
              this.form.room_price = row.room_price
              this.form.start_at = row.start_at
              this.form.end_at = row.end_at
              this.form.room_status = row.room_status == 1 ? false: true
              this.fileList = [{
                name: 'img',
                url: row.img
              }]
            },
            updateService(){
              if(this.form.name == ''){
                this.$message.error('产品名称不能为空')
                return
              }
              if(this.fileList.length == 0){
                this.$message.error('服务图片未上传')
                return
              }
              apiServiceListSave({
                id: this.updateId,
                name: this.form.name,
                img: this.fileList[0].url,
                sort: 1,
                room_number: this.form.room_number,
                room_price: this.form.room_price,
                room_status: this.form.room_status ? 2 : 1,
                start_at: this.form.start_at,
                end_at: this.form.end_at
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
              this.$confirm('确定删除当前菜谱?', '提示', {
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
               apiServiceListDelete({
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
