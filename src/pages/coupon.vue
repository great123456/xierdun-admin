<!-- 优惠券 -->
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>美食banner</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              
              <el-button type="primary" plain @click="addBanner">添加优惠券</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                 <el-table-column prop="begin" label="开始日期"></el-table-column>
                 <el-table-column prop="begin" label="结束日期"></el-table-column>
                 <el-table-column prop="count" label="优惠券数量"></el-table-column>
                 <el-table-column prop="discount" label="折扣金额"></el-table-column>
                 <el-table-column prop="limit" label="限制使用金额"></el-table-column>
                 <el-table-column prop="is_vaild" label="是否有效"></el-table-column>
                 <el-table-column prop="status" label="状态"></el-table-column>
                 <el-table-column prop="user_coupon_count" label="用户领取数量"></el-table-column>
                 <el-table-column label="操作">
                   <template slot-scope="scope">
                      <el-button
                         size="mini"
                         type="primary"
                         @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                      <!-- <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.row)">删除</el-button> -->
                    </template>
                 </el-table-column>
            </el-table>
        </div>

        <!-- 添加优惠券 -->
        <el-dialog title="添加优惠券" :visible.sync="addVisible" width="500px">
            <el-form ref="form" :model="form" label-width="100px">
              <el-form-item label="优惠券数量">
                  <el-input v-model="form.count"></el-input>
              </el-form-item>
              <el-form-item label="折扣金额">
                  <el-input v-model="form.discount"></el-input>
              </el-form-item>
              <el-form-item label="限制使用金额">
                  <el-input v-model="form.limit"></el-input>
              </el-form-item>
              <el-form-item label="开始时间">
                    <el-date-picker
                          v-model="form.begin"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="开始时间">
                    </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
                    <el-date-picker
                          v-model="form.end"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="结束时间">
                    </el-date-picker>
              </el-form-item>
            </el-form>
           
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">添加</el-button>
            </span>
        </el-dialog>


        <!-- 修改优惠券 -->
        <el-dialog title="编辑优惠券" :visible.sync="updateDialog" width="500px">
            <el-form ref="form" :model="form" label-width="100px">
              <el-form-item label="优惠券数量">
                  <el-input v-model="form.count"></el-input>
              </el-form-item>
              <el-form-item label="折扣金额">
                  <el-input v-model="form.discount"></el-input>
              </el-form-item>
              <el-form-item label="限制使用金额">
                  <el-input v-model="form.limit"></el-input>
              </el-form-item>
              <el-form-item label="开始时间">
                    <el-date-picker
                          v-model="form.begin"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="开始时间">
                    </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
                    <el-date-picker
                          v-model="form.end"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="结束时间">
                    </el-date-picker>
              </el-form-item>
              <el-form-item label="是否可用">
                  <el-switch v-model="form.status"></el-switch>
              </el-form-item>
            </el-form>
           
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateCoupon">修改</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import { apiCouponListAdd,apiCouponList,apiBannerDelete,apiCouponListUpdate } from '@/service'
    export default {
        data() {
            return {
                tableData: [],
                fileList: [],
                cur_page: 1,
                fileName:'',
                schoolId:'',
                addVisible: false,
                delVisible: false,
                updateDialog: false,
                imageUrl: '',
                deleteId: '',
                form: {
                  count: '',
                  discount: '',
                  limit: '',
                  begin: '',
                  end: '',
                  status: true
                },
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
            getData(){
              apiCouponList()
              .then((res) => {
                  this.tableData = res.data.list
                  this.tableData.forEach(function(item){
                    item.is_vaild = item.is_vaild == 1?'有效':'过期'
                    item.status = item.status == 1?'正常':'禁用'
                  })
              })
            },
            addBanner(){
              this.addVisible = true
              this.fileList = []
            },
            // 添加优惠券
            saveEdit() {
              const self = this
              apiCouponListAdd({
                begin: this.form.begin,
                end: this.form.end,
                count: this.form.count,
                discount: this.form.discount,
                limit: this.form.limit
              })
              .then((res) => {
                if(res.code == 200){
                  self.$message.success('添加成功')
                  self.addVisible = false
                  self.getData()
                }else{
                  self.$message.error(res.message)
                }
              })
            },
            updateCoupon(){
              const self = this
              apiCouponListUpdate({
                begin: this.form.begin,
                end: this.form.end,
                count: this.form.count,
                discount: this.form.discount,
                limit: this.form.limit,
                id: this.updateId,
                status: this.form.status?1:2
              })
              .then((res) => {
                if(res.code == 200){
                  self.$message.success('修改成功')
                  self.updateDialog = false
                  self.getData()
                }else{
                  self.$message.error(res.message)
                }
              })
            },
            handleEdit(index,row){
              console.log('row',row)
              this.updateDialog = true
              this.updateId = row.id
              this.form.begin = row.begin
              this.form.end = row.end
              this.form.count = row.count
              this.form.discount = row.discount
              this.form.limit = row.limit
              this.form.status = row.status == '正常'?true:false
            },
            handleDelete(row){
               this.deleteId = row.id
               this.$confirm('确定删除当前banner?', '提示', {
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
              apiBannerDelete({
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
        width: 200px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .file-put{
            margin-top:10px;
            margin-left: 20px;
            position: relative;
            width: 90px;
            height: 26px;
            border: 1px solid #99D3F5;
            overflow: hidden;
            color: #ffffff;
            text-decoration: none;
            text-indent: 0;
            line-height: 26px;
            background: #409EFF;
            cursor: pointer;
            text-align: center;
            input{
              position: absolute;
              font-size: 16px;
              right: 0;
              top: 0;
              opacity: 0;
              cursor: pointer;
            }
          }
          .file-name{
            text-indent:20px;
          }
</style>
