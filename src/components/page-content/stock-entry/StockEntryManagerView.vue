<template>
  <div class="StockEntryManagerView flex-box flex-column">
    <search-card-layout :loading="loading" @click-search="refreshData">
      <div class="flex-box search-card">
        <div class="">
          <span>{{ titleText }}单号</span>
          <el-input v-model="filterForm.number"></el-input>
        </div>
        <div class="">
          <span>订单号</span>
          <el-input v-model="filterForm.orderNumber"></el-input>
        </div>
        <div class="">
          <span>公司名称</span>
          <el-input v-model="filterForm.companyName"></el-input>
        </div>
        <div class="" style="width: 200px">
          <span>{{ titleText }}单分类</span>
          <category-selector
            v-model="filterForm.categoryId"
            :type="categoryType"
            :is-filter="true"
          ></category-selector>
        </div>
        <div class="" style="width: 200px">
          <span>审批状态</span>
          <approve-selector
            v-model="filterForm.status"
            :is-filter="true"
            :is-stock-in="type === 1"
          ></approve-selector>
        </div>
        <div class="">
          <span>创建时间</span>
          <date-time-range-input
            :start-time.sync="filterForm.startTime"
            :end-time.sync="filterForm.endTime"
          ></date-time-range-input>
        </div>
      </div>

      <el-button-curd-group
        slot="buttons"
        :delete-disabled="!selectedRow.length"
        :edit-disabled="selectedRow.length !== 1"
        @click-add="clickAddButton"
        @click-edit="clickEditButton"
        @click-delete="clickDeleteButton"
      >
        <el-button-group class="ml-xs">
          <el-button-mini
            icon="iconfont icon-notes-medical"
            :disabled="!submitEnable"
            @click.native="clickSubmitButton"
            >提交审核
          </el-button-mini>
          <!--                    修改-->
          <el-button-mini
            icon="iconfont icon-check-circle"
            icon-color-class="color-red"
            :disabled="!rejectEnable"
            @click.native="clickOpinionButton"
            >审批通过
          </el-button-mini>
          <el-button-mini
            icon="iconfont icon-times-circle"
            icon-color-class="color-red"
            :disabled="!rejectEnable"
            @click.native="clickRejectButton"
            >驳回
          </el-button-mini>
          <el-button-mini
            icon="iconfont icon-circle"
            icon-color-class="color-olive"
            :disabled="!finishEnable"
            @click.native="clickFinishButton"
            v-if="type === 1"
            >订单完成
          </el-button-mini>
          <el-button-mini
            icon="iconfont icon-truck"
            icon-color-class="color-olive"
            :disabled="!finishEnable"
            v-if="type === 2"
            @click.native="clickDeliveryButton"
            >完成发货
          </el-button-mini>
          <el-button
            :disabled="!finishEnable"
            v-if="type === 2"
            size="mini"
            icon="el-icon-printer"
            @click="doPrinter"
            >打印</el-button
          >
        </el-button-group>
      </el-button-curd-group>
    </search-card-layout>

    <div class="flex-grow">
      <table-panel
        :loading="loading"
        :data="data"
        :paginate="paginate"
        operate-width="140"
        :selectedRow.sync="selectedRow"
        @sort-change="sortChange"
        :create-user-show="true"
        :update-user-show="true"
      >
        <el-table-column
          prop="id"
          label="ID"
          sortable="custom"
          width="80"
        ></el-table-column>

        <el-table-column
          prop="number"
          :label="`${titleText}单号`"
          sortable="custom"
          width="180"
        ></el-table-column>

        <el-table-column
          prop="orderNumber"
          :label="`订单号`"
          sortable="custom"
          width="180"
        ></el-table-column>
        <el-table-column prop="moveCount" :label="`明细条数`" width="100">
          <template slot-scope="{ row }">
            <el-button-mini
              type="text"
              title="查看和编辑明细"
              icon="iconfont icon-th-list"
              @click.native="clickRowDetailButton(row)"
            ></el-button-mini>
            <el-button-mini
              type="text"
              icon="iconfont icon-plus-circle"
              @click.native="clickRowAddMoveButton(row)"
              v-if="[1, 4].includes(row.status)"
            ></el-button-mini>
            <span class="ml-xs">{{ row.moveCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="`${titleText}状态`"
          sortable="custom"
          width="105"
        >
          <div class="flex-box flex-center" slot-scope="{ row }">
            <approve-tags
              :status="row.status"
              :is-stock-in="type === 1"
            ></approve-tags>
            <div
              class=""
              style="padding-top: 2px; margin-left: 2px"
              v-if="row.type === 2 && row.status === 5 && row.deliveryId !== 0"
            >
              <el-tag type="info" class="cursor-p">
                <i class="iconfont icon-truck"></i>
              </el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column
          prop="categoryId"
          :label="`${titleText}类型`"
          sortable="custom"
          width="120"
        >
          <template slot-scope="{ row }">{{ row.categoryName }}</template>
        </el-table-column>
        <el-table-column
          prop="companyId"
          :label="`公司名称`"
          sortable="custom"
          width="200"
        >
          <template slot-scope="{ row }">{{ row.companyName }}</template>
        </el-table-column>

        <el-table-column
          prop="remark"
          :label="`备注`"
          width="200"
          :show-overflow-tooltip="true"
        >
        </el-table-column>

        <el-table-column
          prop="rejectRemark"
          :label="`驳回理由`"
          width="200"
          :show-overflow-tooltip="true"
        >
        </el-table-column>

        <el-table-column
          prop="leaderSuggest"
          :label="`审批意见`"
          width="200"
          :show-overflow-tooltip="true"
        >
        </el-table-column>

        <el-table-column
          prop="auditPeopleName"
          label="审批人"
          width="100"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <!-- 派送人/提货人 -->
        <el-table-column
          prop="sendPeople"
          :label="`${titleText2}`"
          sortable="custom"
          width="120"
        >
        </el-table-column>
        <!--接收人/交货人-->
        <el-table-column
          prop="realName"
          :label="`${titleText3}`"
          sortable="custom"
          width="120"
        >
        </el-table-column>

        <template slot="operate" slot-scope="{ row }">
          <el-button-mini
            type="text"
            icon="edit"
            title="编辑"
            @click.native="clickRowEditButton(row)"
          ></el-button-mini>
          <el-button-mini
            type="text"
            title="预览查看"
            icon="iconfont icon-eye1"
            @click.native="clickRowPreviewButton(row)"
          ></el-button-mini>
          <el-button-mini
            type="text"
            icon="delete"
            title="删除"
            v-if="row.status === 1"
            @click.native="clickRowDeleteButton(row)"
          ></el-button-mini>
          <el-button-mini
            type="text"
            icon="iconfont icon-notes-medical"
            title="提交审批"
            v-if="[1, 4].includes(row.status) && row.moveCount > 0"
            @click.native="clickRowSubmitButton(row)"
          >
          </el-button-mini>
          <el-button-mini
            type="text"
            icon="iconfont icon-check-circle"
            title="审批通过"
            v-if="row.status === 2"
            @click.native="clickRowOpinionButton(row)"
          ></el-button-mini>
          <el-button-mini
            type="text"
            icon="iconfont icon-times-circle"
            title="驳回"
            v-if="row.status === 2"
            @click.native="clickRowRejectButton(row)"
          ></el-button-mini>
          <el-button-mini
            type="text"
            icon="iconfont icon-circle"
            title="完成订单"
            v-if="row.status === 3 && type === 1"
            @click.native="clickRowFinishButton(row)"
          ></el-button-mini>
          <el-button-mini
            type="text"
            icon="iconfont icon-truck"
            icon-color-class="color-olive"
            title="完成发货"
            v-if="row.status === 3 && type === 2"
            @click.native="clickRowDeliveryButton(row)"
          ></el-button-mini>
        </template>
      </table-panel>
    </div>
    <stock-entry-add-dialog
      :visible.sync="showAddDialog"
      :edit-id="editId"
      @finish="refreshData"
      :type="type"
    ></stock-entry-add-dialog>

    <move-list-dialog
      :visible.sync="showMoveListDialog"
      :stock-entry="selectStockEntry"
      :type="type"
      @close="refreshData"
    ></move-list-dialog>

    <move-add-dialog
      :visible.sync="showMoveAddDialog"
      :edit-id="0"
      :type="type"
      :stock-entry="selectStockEntry"
      @finish="refreshData"
    ></move-add-dialog>

    <stock-entry-preview-dialog
      :visible.sync="showPreviewDialog"
      :edit-id="editId"
      :type="type"
    ></stock-entry-preview-dialog>

    <stock-entry-reject-dialog
      :visible.sync="showRejectDialog"
      :stock-entry="selectStockEntry"
      :type="type"
      @finish="refreshData"
    ></stock-entry-reject-dialog>
    <!--修改-->
    <stock-entry-opinion-dialog
      :visible.sync="showOpinionDialog"
      :stock-entry="selectStockEntry"
      :type="type"
      @finish="refreshData"
    ></stock-entry-opinion-dialog>
    <stock-entry-delivery-finish-dialog
      :visible.sync="showDeliveryFinishDialog"
      :stock-entry="selectStockEntry"
      :type="type"
      @finish="refreshData"
    ></stock-entry-delivery-finish-dialog>
    <the-printer
      :visible.sync="showPrinterDialog"
      :stock-entry="selectStockEntry"
      @finish="refreshData"
    ></the-printer>
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
import ElButtonCurdGroup from "@/components/common/button/ElButtonCurdGroup";
import DateTimeRangeInput from "@/components/common/input/DateTimeRangeInput";
import CategorySelector from "@/components/page-content/enum-selector/CategorySelector";
import StockEntryAddDialog from "@/components/page-content/stock-entry/dialog/StockEntryAddDialog";
import MoveListDialog from "@/components/page-content/stock-entry/dialog/MoveListDialog";
import MoveAddDialog from "@/components/page-content/stock-entry/dialog/MoveAddDialog";
import ApproveSelector from "@/components/page-content/enum-selector/ApproveSelector";
import ApproveEnum from "@/project/enum/ApproveEnum";
import ApproveTags from "@/components/page-content/enum-selector/ApproveTags";
import StockEntryPreviewDialog from "@/components/page-content/stock-entry/dialog/StockEntryPreviewDialog";
import StockEntryRejectDialog from "@/components/page-content/stock-entry/dialog/StockEntryRejectDialog";
import StockEntryDeliveryFinishDialog from "@/components/page-content/stock-entry/dialog/StockEntryDeliveryFinishDialog";
import StockEntryOpinionDialog from "./dialog/StockEntryOpinionDialog";
import ThePrinter from "./dialog/ThePrinter";
export default {
  name: "StockEntryManagerView",
  components: {
    StockEntryOpinionDialog,
    StockEntryDeliveryFinishDialog,
    StockEntryRejectDialog,
    StockEntryPreviewDialog,
    ApproveTags,
    ApproveSelector,
    MoveAddDialog,
    MoveListDialog,
    StockEntryAddDialog,
    CategorySelector,
    DateTimeRangeInput,
    ElButtonCurdGroup,
    TablePanel,
    ElButtonMini,
    SearchCardLayout,
    ThePrinter,
  },
  props: {
    // 出入库 1:入库；2：出库
    type: {
      default: 1,
    },
    params: Object,
  },
  data() {
    return {
      loading: false,
      showAddDialog: false,
      showMoveListDialog: false,
      showMoveAddDialog: false,
      showPreviewDialog: false,
      showRejectDialog: false,
      //修改
      showOpinionDialog: false,
      showDeliveryFinishDialog: false,
      filterForm: new StockEntryModel(this.type),
      data: [],
      paginate: new PaginateModel(this.refreshData),
      selectedRow: [],
      sortingColumn: null,
      editId: 0,
      selectStockEntry: new StockEntryModel(),
      statusEnum: ApproveEnum,
      showPrinterDialog: false,
    };
  },
  mounted() {
    EcUtil.initParams(this);
    this.reload();
  },
  methods: {
    doPrinter() {
      this.selectStockEntry = this.selectedRow[0];
      this.showPrinterDialog = true;
    },
    reload() {
      this.refreshData();
    },
    refreshData() {
      this.loading = true;
      this.$ajax
        .request(Api.stockEntry.list, {
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
    // // 打印
    // import Print from '@/util/Print';

    sortChange(nodes) {
      this.sortingColumn = nodes;
      this.refreshData();
    },

    clickAddButton() {
      this.editId = 0;
      this.selectStockEntry = this.selectedRow[0];
      this.showAddDialog = true;
    },
    clickEditButton() {
      this.editId = this.selectedRow[0].id;
      this.showAddDialog = true;
    },
    clickDeleteButton() {
      this.delete(this.selectedRow);
    },
    clickRowEditButton(row) {
      this.editId = row.id;
      this.showAddDialog = true;
    },
    clickRowDeleteButton(row) {
      this.delete([row]);
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
    delete(nodes) {
      DialogUtil.confirm(
        `
                    确定删除以下入库单吗？ <br>
                    [ ${nodes.map((x) => x.number).join(",")} ]
                `
      )
        .then(() => {
          return this.$ajax.request(Api.stockEntry.delete, {
            ids: nodes.map((x) => x.id).join(","),
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

    clickButton() {
      this.selectStockEntry = this.selectedRow[0];
      this.showRejectDialog = true;
    },
    clickRejectButton() {
      this.selectStockEntry = this.selectedRow[0];
      this.showRejectDialog = true;
    },
    //修改
    clickOpinionButton() {
      this.selectStockEntry = this.selectedRow[0];
      this.showOpinionDialog = true;
      // this.approve(this.selectedRow, true, "通过审批")
    },
    //修改
    clickRowOpinionButton(row) {
      this.selectStockEntry = row;
      this.showOpinionDialog = true;
    },
    clickRowRejectButton(row) {
      this.selectStockEntry = row;
      this.showRejectDialog = true;
    },
    approve(nodes, isApprove = true, title = "通过") {
      DialogUtil.confirm(
        `
                    确定要将以下单号 ${title} 吗？ </br>
                    [ ${nodes[0].number} ] </br>


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
    delivery(nodes) {},
  },
  watch: {},
  computed: {
    titleText() {
      return this.type === 1 ? "入库" : "出库";
    },
    titleText2() {
      return this.type === 1 ? "派送人" : "提货人";
    },
    titleText3() {
      return this.type === 1 ? "接收人" : "交货人";
    },
    categoryType() {
      return this.type === 1 ? 3 : 4;
    },
    submitEnable() {
      if (this.selectedRow.length !== 1) return false;
      return [1, 4].includes(this.selectedRow[0].status);
    },
    approveEnable() {
      if (this.selectedRow.length !== 1) return false;
      return this.selectedRow[0].status === 2;
    },
    rejectEnable() {
      if (this.selectedRow.length !== 1) return false;
      return this.selectedRow[0].status === 2;
    },
    finishEnable() {
      if (this.selectedRow.length !== 1) return false;
      return this.selectedRow[0].status === 3;
    },
  },
};
</script>

<style lang="less" scoped>
@import (reference) "~style/all.less";
</style>