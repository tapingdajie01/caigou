<template>
  <div class="StockEntryManagerView flex-box flex-column">
    <search-card-layout :loading="loading" @click-search="refreshData">
      <div class="flex-box search-card">
        <div class="">
          <span>使用单位</span>
          <el-select
            clearable
            v-model="filterForm.departId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in deptOptions"
              :key="item.departKey"
              :label="item.departValue"
              :value="item.departKey"
            >
            </el-option>
          </el-select>
          <span style="padding-left: 15px">状态</span>
          <el-select v-model="filterForm.status" clearable placeholder="请选择">
            <el-option label="初始录入" value="1"></el-option>
            <el-option label="审核通过" value="3"></el-option>
          </el-select>
          <span style="padding-left: 15px">订单号</span>
          <el-input v-model="filterForm.orderId"></el-input>
        </div>
      </div>
      <functions-button slot="buttons" @click-add="clickAddButton">
      </functions-button>
    </search-card-layout>

    <div class="flex-grow">
      <table-panel
        :loading="loading"
        :data="data"
        :showIndex="false"
        :showSelection="false"
        :paginate="paginate"
        operate-width="140"
        :selectedRow.sync="selectedRow"
        @sort-change="sortChange"
        :create-user-show="false"
        :update-user-show="false"
      >
        <el-table-column
          prop="orderId"
          label="订单编号"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="proposer"
          label="申请人"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="申请时间"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="departId"
          label="申请部门"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          sortable="custom"
        ></el-table-column>
        <template slot="operate" slot-scope="{ row }">
          <el-button-mini
            type="text"
            title="审批"
            :disabled="row.status == '审核通过'"
            @click.native="clickRowEdit(row)"
          >审批</el-button-mini>
          <!-- <el-button-mini
            type="text"
            icon="delete"
            title="删除"
            @click.native="clickRowDelete(row)"
          ></el-button-mini> -->
        </template>
      </table-panel>
    </div>
    <Add :visible.sync="showAddDialog" @finish="refreshData"></Add>
    <Edit
      :visible.sync="showEditDialog"
      :data="editRow"
      @finish111="refreshData"
    />
  </div>
</template>

<script>
import DialogUtil from "@/util/DialogUtil";
import StockEntryModel from "@/project/model/StockEntryModel";
import PaginateModel from "@/project/model/PaginateModel";
import Api from "@/assets/api/Api";
import EcUtil from "@/util/EcUtil";
import SearchCardLayout from "@/components/layout-component/SearchCardLayout";
import ElButtonMini from "@/components/common/button/ElButtonMini";
import TablePanel from "@/components/layout-component/TablePanel";
import FunctionsButton from "./dialog/FunctionsButton";
import Edit from "./dialog/Edit";
import Add from "./dialog/Add";
export default {
  name: "assetManage",
  components: {
    Add,
    FunctionsButton,
    Edit,
    TablePanel,
    ElButtonMini,
    SearchCardLayout,
  },
  data() {
    return {
      loading: false,
      showAddDialog: false,
      filterForm: {
        departId: "",
        status: "",
        orderId: "",
      },
      data: [],
      paginate: new PaginateModel(this.refreshData),
      selectedRow: [],
      sortingColumn: null,
      editId: 0,
      selectStockEntry: new StockEntryModel(),
      deptOptions: [],
      showEditDialog: false,
      editRow: {},
    };
  },
  mounted() {
    this.reload();
    //初始化部门选择下拉框
    this.initDept();
  },
  methods: {
    initDept() {
      this.$ajax
        .request(Api.assetsEntry.getDept, {})
        .then((resp) => {
          this.deptOptions = resp;
        })
        .catch(() => {
          alert("查询出错，请联系系统管理员");
        });
    },
    reload() {
      this.refreshData();
    },
    refreshData() {
      this.loading = true;
      this.$ajax
        .request(Api.assetsEntry.selectInventoryNum, {
          ...EcUtil.getSortField(this.sortingColumn),
          ...this.paginate.getJSON(),
          ...this.filterForm,
        })
        .then((resp) => {
          this.data = resp;
          this.paginate.setPaginate(resp);
        })
        .finally(() => (this.loading = false));
    },
    sortChange(nodes) {
      this.sortingColumn = nodes;
      this.refreshData();
    },
    clickAddButton() {
      this.editId = 0;
      this.selectStockEntry = this.selectedRow[0];
      this.showAddDialog = true;
    },
    clickRowEdit(row) {
      this.loading = true;
      let reqData = {
        condition: '3',
        smartAllotId: row.id
      }
      this.$ajax
        .request(Api.assetsEntry.updateList, reqData)
        .then(() => {
          DialogUtil.toastSuccess('更新成功！');
          this.refreshData();
        })
        .finally(() => (this.loading = false));
    },
    clickRowDelete(row) {
      this.delete(row);
    },
    delete(row) {
      DialogUtil.confirm(`确定删除此条数据吗？`)
        .then(() => {
          return this.$ajax.request(Api.assetsEntry.delete, {
            departId: row.departId,
            materialCode: row.materialCode,
          });
        })
        .then((resp) => {
          DialogUtil.toastSuccess(resp);
          this.refreshData();
        });
    },
  },
};
</script>

<style lang="less" scoped>
@import (reference) "~style/all.less";
</style>