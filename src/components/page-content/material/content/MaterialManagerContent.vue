<template>
    <div class="MaterialManagerContent flex-box flex-column">
        <search-card-layout
                @click-search="refreshData"
                :loading="loading"
        >
            <div class="flex-box search-card">
                <div class="">
                    <span>{{ nameText }}编号</span>
                    <el-input v-model="filterForm.code"></el-input>
                </div>
                <div class="">
                    <span>{{ nameText }}名称</span>
                    <el-input v-model="filterForm.name"></el-input>
                </div>
                <div class="" style="width: 200px;">
                    <span>{{ nameText }}分类</span>
                    <category-selector
                            :type="categoryType"
                            v-model="filterForm.categoryId"
                            :is-filter="true"
                    ></category-selector>
                </div>
                <div class="" style="width: 130px;">
                    <span>单位</span>
                    <category-selector
                            :type="1"
                            v-model="filterForm.unitId"
                            :is-filter="true"
                    ></category-selector>
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
                            icon="iconfont el-icon-printer"
                            @click.native="barCode"
                    >条形码打印
                    </el-button-mini>
                    </el-button-group>
            
            </el-button-curd-group>
        </search-card-layout>
        <div class="flex-grow">
            <table-panel
                    :loading="loading"
                    :data="data"
                    :paginate="paginate"
                    operate-width="80"
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
                        prop="code"
                        :label="`${nameText}编号`"
                        sortable="custom"
                        width="140"
                ></el-table-column>

                <el-table-column
                        prop="name"
                        :label="`${nameText}名称`"
                        sortable="custom"
                        width="160"
                ></el-table-column>

                <el-table-column
                        prop="categoryId"
                        :label="`${nameText}分类`"
                        sortable="custom"
                        width="140"
                >
                    <template slot-scope="{row}">{{ row.categoryName }}</template>
                </el-table-column>

                <el-table-column
                        prop="unitId"
                        label="单位"
                        sortable="custom"
                        width="80"
                >
                    <template slot-scope="{row}">{{ row.unitName }}</template>
                </el-table-column>

                <el-table-column
                        prop="safeNum"
                        label="数量"
                        sortable="custom"
                        width="100"
                ></el-table-column>

                <el-table-column
                        prop="validDay"
                        label="有效天数"
                        sortable="custom"
                        width="100"
                >
                    <template slot-scope="{row}">{{ row.validDay || "永久有效"}}</template>
                </el-table-column>
  <el-table-column
                        prop="validDay"
                        label="供应商"
                        sortable="custom"
                        width="100"
                >
                    <template slot-scope="{row}">{{ row.validDay || "永久有效"}}</template>
                </el-table-column>
                  <el-table-column
                        prop="validDay"
                        label="采购单价"
                        sortable="custom"
                        width="100"
                >
                    <template slot-scope="{row}">{{ row.validDay || "永久有效"}}</template>
                </el-table-column>
                  <el-table-column
                        prop="validDay"
                        label="库存总数"
                        sortable="custom"
                        width="100"
                >
                    <template slot-scope="{row}">{{ row.validDay || "永久有效"}}</template>
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="产品描述"
                        width="160"
                ></el-table-column>

                <template slot="operate" slot-scope="{row}">
                    <el-button-mini
                            type="text"
                            icon="edit"
                            @click.native="clickRowEditButton(row)"
                    ></el-button-mini>
                    <el-button-mini
                            type="text"
                            icon="delete"
                            @click.native="clickRowDeleteButton(row)"
                    ></el-button-mini>
                </template>
            </table-panel>
        </div>
        <material-add-dialog
                :edit-id="editId"
                :visible.sync="showAddDialog"
                @finish="refreshData"
                :category-type="categoryType"
                :type="type"
        ></material-add-dialog>
        <div>
        <el-dialog
            title="打印条形码"
            :visible.sync="centerDialogVisible"
            width="32%"
            @opened="open()"
            center>
            <span class="dialog-header">
                <el-row :gutter="10">
                    <el-col :xs="8" :sm="6">物料名称:</el-col>
                    <el-col :xs="8" :sm="6">{{code}}</el-col>
                </el-row>
            </span>
            <span class="dialog-body">
                <el-row :gutter="10">
                    <el-col :xs="8" :sm="6">条形码:</el-col>
                    <el-col :xs="8" :sm="6"><img id="barcode"/>
                    </el-col>
                </el-row>
            </span>
             
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <!-- <el-button type="primary" @click="centerDialogVisible = false">打 印</el-button> -->
                <el-button type="primary" v-print="'#barcode'">打 印</el-button>
            </span>
        </el-dialog>
        </div>
    </div>
    </template>

<script>
    import JsBarcode from 'jsbarcode';
    import DialogUtil from "@/util/DialogUtil";
    import EcUtil from "@/util/EcUtil";
    import Api from "@/assets/api/Api";
    import SearchCardLayout from "@/components/layout-component/SearchCardLayout";
    import ElButtonCurdGroup from "@/components/common/button/ElButtonCurdGroup";
    import TablePanel from "@/components/layout-component/TablePanel";
    import ElButtonMini from "@/components/common/button/ElButtonMini";
    import MaterialModel from "@/project/model/MaterialModel";
    import PaginateModel from "@/project/model/PaginateModel";
    import MaterialAddDialog from "@/components/page-content/material/dialog/MaterialAddDialog";
    import CategorySelector from "@/components/page-content/enum-selector/CategorySelector";
    export default {
        name: "MaterialManagerContent",
        components: {
            CategorySelector,
            MaterialAddDialog,
            ElButtonMini,
            TablePanel,
            ElButtonCurdGroup,
            SearchCardLayout
        },
        props: {
            type: {
                default: 1
            },
        },
        data() {
            return {
                loading: false,
                showAddDialog: false,
                filterForm: new MaterialModel(),
                data: [],
                paginate: new PaginateModel(this.refreshData),
                selectedRow: [],
                sortingColumn: null,
                editId: 0,
                centerDialogVisible: false,
                code: ``
            }
        },
        mounted() {
            this.reload();
        },
        methods: {
            reload() {
                this.refreshData();
            },
            refreshData() {
                this.loading = true;
                this.filterForm.type = this.type ;
                this.$ajax.request(Api.material.list, {
                    ...EcUtil.getSortField(this.sortingColumn),
                    ...this.paginate.getJSON(),
                    ...this.filterForm,
                }).then(resp => {
                    this.data = resp.list;
                    this.paginate.setPaginate(resp);
                }).finally(() => this.loading = false)
            },

            sortChange(nodes) {
                this.sortingColumn = nodes;
                this.refreshData();
            },

            clickAddButton() {
                this.editId = 0;
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
            delete(nodes) {
                DialogUtil.confirm(`
                    确定删除以下部门吗？ <br>
                    [ ${nodes.map(x => x.name).join(',')} ]
                `).then(() => {
                    return this.$ajax.request(Api.material.delete, {
                        ids: nodes.map(x => x.id).join(',')
                    });
                }).then(resp => {
                    DialogUtil.toastSuccess(resp);
                    this.refreshData();
                })
            },
            barCode(){
                this.centerDialogVisible=true
                this.code = this.selectedRow[0].name
            },
            open(){
                JsBarcode('#barcode', this.selectedRow[0].id,{
                    format: 'CODE128',
                    lineColor: '#000',
                    background: '#EBEEF5',
                    width: 5,
                    height: 100 ,
                    displayValue: true,
                    marginTop: 58, // 上边距
                    marginLeft: 70, // 左边距
                    fontOptions:"bold", // 使文字加粗体或变斜体
                    text:this.selectedRow[0].name, //覆盖显示文本
                    fontSize:30
                })
            }
        },
        watch: {},
        computed: {
            categoryType() {
                return this.type === 1 ? 2 : 7;
            },
            nameText() {
                return this.type === 1 ? '物料' : '产品'
            }
        },

    }
</script>

<style lang="less" scoped>
    @import (reference) "~style/all.less";

    .MaterialManagerContent {
    }
</style>