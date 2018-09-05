<!-- 订单管理 -->
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>订单列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-select v-model="typeId" placeholder="请选择订单类型" @change="selectType">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                  </el-option>
              </el-select>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="created_at" label="订单日期" sortable width="200"></el-table-column>
                <el-table-column prop="type" label="订单类型" width="200"></el-table-column>
                <el-table-column prop="name" label="姓名" width="120"></el-table-column>
                <el-table-column prop="phone" label="手机号" width="200"></el-table-column>
                <el-table-column prop="room_no" label="房间号" width="120"></el-table-column>
                <el-table-column prop="order_no" label="身份证号码" width="200"></el-table-column>
                <el-table-column prop="total" label="订单金额" width="120"></el-table-column>
                <el-table-column prop="productName" label="商品名称" width="200"></el-table-column>
                <el-table-column prop="productPrice" label="商品价格" width="200"></el-table-column>
                <el-table-column prop="productAmount" label="购买数量" width="200"></el-table-column>
                <el-table-column prop="remark" label="备注信息" width="200"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
    import { apiOrderList } from '@/service'
    export default {
        data() {
            return {
                typeList: [{
                    label: '美食订单',
                    id: 1
                },{
                    label: '服务订单',
                    id: 2
                }],
                typeId: 1,
                tableData: [],
                cur_page: 1,
                pageSize: 10,
                total: 0,
                select_cate: '',
                select_word: '',
                is_search: false
            }
        },
        created() {
            this.getData();
        },
        computed: {

        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getData() {
                apiOrderList({
                    type: this.typeId,
                    page: this.cur_page
                })
                .then((res) => {
                    console.log('res-order',res.data)
                    this.tableData = res.data.list
                    this.tableData.forEach(function(item){
                        item.type = item.type == 1?'美食订单':'服务订单'
                        item.productName = item.detail[0].name
                        item.productPrice = item.detail[0].price
                        item.productAmount = item.detail[0].amount
                    })
                    this.total = res.data.total
                })
            },
            selectType(){
              this.getData()
            },
            search() {
                this.is_search = true;
            },
            // 保存编辑
            saveEdit() {

            },
            // 确定删除
            deleteRow(){

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
