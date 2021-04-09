<template>
  <div class="StockEntryManagerView flex-box flex-column">
    <search-card-layout :loading="loading" @click-search="refreshData">
      <div class="flex-box search-card">
        <div class="">
          <span>使用单位</span>
          <el-select
            @change="handleClick"
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
          <span style="padding-left: 15px">资产编码</span>
          <el-select v-model="filterForm.materialId" placeholder="请选择">
            <el-option
              v-for="item in materialOptions"
              :key="item.materialKey"
              :label="item.materialValue"
              :value="item.materialKey"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <functions-button slot="buttons" @click-add="clickAddButton">
      </functions-button>
    </search-card-layout>

    <div class="flex-grow">
      <table-panel
        :loading="loading"
        :data="data"
        :paginate="paginate"
        operate-width="140"
        :selectedRow.sync="selectedRow"
        @sort-change="sortChange"
        :create-user-show="false"
        :update-user-show="false"
      >
        <el-table-column
          prop="materialCode"
          label="资产编码"
          sortable="custom"
        ></el-table-column>
        <el-table-column
            prop="departName"
            label="使用单位"
            sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="materialName"
          label="资产名称"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="materialUsing"
          label="资产使用数"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="materialFree"
          label="资产空闲数"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="materialBroken"
          label="资产损坏数"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="materialLoss"
          label="资产损耗数"
          sortable="custom"
        ></el-table-column>
        <template slot="operate" slot-scope="{ row }">
          <el-button-mini
            type="text"
            icon="edit"
            title="编辑"
            @click.native="clickRowEdit(row)"
          ></el-button-mini>
          <el-button-mini
            type="text"
            icon="delete"
            title="删除"
            @click.native="clickRowDelete(row)"
          ></el-button-mini>
        </template>
      </table-panel>
    </div>
    <stock-entry-add-dialog
      :visible.sync="showAddDialog"
      @finish="refreshData"
    ></stock-entry-add-dialog>
    <Edit :visible.sync="showEditDialog" :data="editRow" @finish="refreshData" />
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
import StockEntryAddDialog from "@/components/page-content/user-management/assetManage/dialog/StockEntryAddDialog";

import MoveListDialog from "@/components/page-content/stock-entry/dialog/MoveListDialog";
import MoveAddDialog from "@/components/page-content/stock-entry/dialog/MoveAddDialog";
import ApproveEnum from "@/project/enum/ApproveEnum";
import ApproveTags from "@/components/page-content/enum-selector/ApproveTags";
import StockEntryPreviewDialog from "@/components/page-content/stock-entry/dialog/StockEntryPreviewDialog";
import StockEntryRejectDialog from "@/components/page-content/stock-entry/dialog/StockEntryRejectDialog";
import StockEntryDeliveryFinishDialog from "@/components/page-content/stock-entry/dialog/StockEntryDeliveryFinishDialog";

export default {
  name: "assetManage",
  components: {
    StockEntryDeliveryFinishDialog,
    StockEntryRejectDialog,
    StockEntryPreviewDialog,
    ApproveTags,
    MoveAddDialog,
    MoveListDialog,
    StockEntryAddDialog,
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
      showMoveListDialog: false,
      showMoveAddDialog: false,
      showPreviewDialog: false,
      showRejectDialog: false,
      showDeliveryFinishDialog: false,
      filterForm: {
        departId: "",
        materialId: "",
      },
      data: [],
      paginate: new PaginateModel(this.refreshData),
      selectedRow: [],
      sortingColumn: null,
      editId: 0,
      selectStockEntry: new StockEntryModel(),
      statusEnum: ApproveEnum,
      deptOptions: [],
      materialOptions: [],
      showEditDialog: false,
      editRow: {}
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
    handleClick(val) {
      if (val) {
        this.initMaterial();
        this.filterForm.materialCode = "";
      } else {
        this.materialOptions = [];
        this.filterForm.materialCode = "";
      }
    },
    //初始化资产管理选择菜单
    initMaterial() {
      let params = {
        departKey: this.filterForm.departId,
      };
      this.$ajax
        .request(Api.assetsEntry.getDeptAssets, params)
        .then((resp) => {
          this.materialOptions = resp;
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
        .request(Api.assetsEntry.list, {
          ...EcUtil.getSortField(this.sortingColumn),
          ...this.paginate.getJSON(),
          ...this.filterForm,
        })
        .then((resp) => {
          this.data = resp.list;
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
      this.editRow = row;
      this.showEditDialog = true;
    },
    clickRowDelete(row) {
      this.delete(row);
    },
    clickRowDetailButton(row) {
      this.selectStockEntry = row;
      this.showMoveListDialog = true;
    },
    clickRowPreviewButton(row) {
      this.editId = row.id;
      this.showPreviewDialog = true;
    },
    clickRowAddMoveButton(row) {
      this.editId = 0;
      this.selectStockEntry = row;
      this.showMoveAddDialog = true;
    },
    delete(row) {
      DialogUtil.confirm(`确定删除此条数据吗？`)
        .then(() => {
          return this.$ajax.request(Api.assetsEntry.delete, {
            departId:row.departId,
            materialCode:row.materialCode
          });
        })
        .then((resp) => {
          DialogUtil.toastSuccess(resp);
          this.refreshData();
        });
    },
    clickApproveButton() {
      this.approve(this.selectedRow, true, "通过审批");
    },
    clickRowApproveButton(row) {
      this.approve([row], true, "通过审批");
    },
    clickRejectButton() {
      this.selectStockEntry = this.selectedRow[0];
      this.showRejectDialog = true;
    },
    clickRowRejectButton(row) {
      this.selectStockEntry = row;
      this.showRejectDialog = true;
    },
    approve(nodes, isApprove = true, title = "通过") {
      DialogUtil.confirm(
        `
                    确定要将以下单号 ${title} 吗？ </br>
                    [ ${nodes[0].number} ]
                `
      )
        .then(() => {
          let se = Object.assign({}, nodes[0]);
          se.status = isApprove ? 3 : 4;
          return this.$ajax.request(Api.stockEntry.approve, se);
        })
        .then((resp) => {
          DialogUtil.toastSuccess(resp);
          this.refreshData();
        });
    },

    clickFinishButton() {
      this.finishSE(this.selectedRow);
    },

    clickRowFinishButton(row) {
      this.finishSE([row]);
    },

    finishSE(nodes) {
      DialogUtil.confirm(
        `
                    确定完成一下单号？ </br>
                    [ ${nodes[0].number} ]
                `
      )
        .then(() => {
          let se = Object.assign({}, nodes[0]);
          se.status = 5;
          return this.$ajax.request(Api.stockEntry.finish, se);
        })
        .then((resp) => {
          DialogUtil.toastSuccess(resp);
          this.refreshData();
        });
    },

    clickSubmitButton() {
      this.submit(this.selectedRow);
    },
    clickRowSubmitButton(row) {
      this.submit([row]);
    },
    submit(nodes) {
      DialogUtil.confirm(
        `
                    确定要将以下订单提交审核吗？ </br>
                    [ ${nodes[0].number} ]
                `
      )
        .then(() => {
          return this.$ajax.request(Api.stockEntry.submit, nodes[0]);
        })
        .then((resp) => {
          DialogUtil.toastSuccess(resp);
          this.refreshData();
        });
    },
    clickDeliveryButton() {
      this.selectStockEntry = this.selectedRow[0];
      this.showDeliveryFinishDialog = true;
    },
    clickRowDeliveryButton(row) {
      this.selectStockEntry = row;
      this.showDeliveryFinishDialog = true;
    },
  },
};
</script>

<style lang="less" scoped>
@import (reference) "~style/all.less";

.StockEntryManagerView {
}
</style>