<template>
    <div class="UserManagerView flex-box flex-column ">
        <search-card-layout
                :loading="loading"
                @click-search="refreshData"
                @click-tongji="showEcharts"
        >
            <el-form class="flex-box flex-center search-card">
                <div class="" style="width: 200px;">
                    <span class="">订单号</span>
                    <el-input v-model="filterForm.userName"></el-input>
                </div>
                <div class="" style="width: 200px;">
                    <span class="">名称</span>
                    <el-input v-model="filterForm.realName"></el-input>
                </div>
                <div class="" style="width: 150px;">
                    <span class="">状态</span>
                    <el-select v-model="filterForm.activated">
                        <el-option label="全部" :value="0"></el-option>
                        <el-option label="已采购" :value="1"></el-option>
                        <el-option label="待审批" :value="2"></el-option>
                    </el-select>
                </div>
                <div class="" style="width: 150px;">
                    <span class="">角色</span>
                    <role-selector v-model="filterForm.roleId" :is-filter="true"></role-selector>
                </div>
            </el-form>

            <div class="" slot="buttons">
                <el-button-curd-group
                        :delete-disabled="!selectedRow.length"
                        :edit-disabled="selectedRow.length !== 1"
                        @click-add="clickAddButton"
                        @click-edit="clickEditButton"
                        @click-delete="clickDeleteButton"
                ></el-button-curd-group>
            </div>
        </search-card-layout>

        <div class="flex-grow">
            <table-panel
                    :loading="loading"
                    :data="data"
                    :paginate="paginate"
                    operate-width="80"
                    :selectedRow.sync="selectedRow"
                    @sort-change="sortChange"
            >
                <el-table-column
                        prop="id"
                        label="订单号"
                        width="90"
                        sortable="custom"
                ></el-table-column>
                <el-table-column
                        prop="itemName"
                        label="名称"
                        width="90"
                        sortable="custom"
                ></el-table-column>
                <el-table-column
                        prop="userName"
                        label="发起人"
                        width="120"
                        sortable="custom"
                ></el-table-column>
                <el-table-column
                        prop="realName"
                        label="发起人姓名"
                        width="120"
                        sortable="custom"
                ></el-table-column>
                <el-table-column
                        prop="roleId"
                        label="角色"
                        width="120"
                        sortable="custom"
                >
                    <span slot-scope="{row}">{{ row.roleName }}</span>
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="手机号"
                        width="120"
                        sortable="custom"
                ></el-table-column>
                <el-table-column
                        prop="activated"
                        label="激活"
                        width="80"
                        sortable="custom"
                >
                    <template slot-scope="{row}">
                        <el-tag v-if="row.activated === 1" type="warning">未激活</el-tag>
                        <el-tag v-if="row.activated === 2" type="success">已激活</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="departId"
                        label="所属部门"
                        min-width="200"
                        sortable="custom"
                >
                    <template slot-scope="{row}">{{row.departName}}</template>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        min-width="150"
                        sortable="custom"
                ></el-table-column>

                <template slot="operate" slot-scope="{row}">
                    <el-button-mini type="text" icon="edit" title="编辑"
                                    @click.native="clickRowEdit(row)"></el-button-mini>
                    <el-button-mini type="text" icon="delete" title="删除"
                                    @click.native="clickRowDelete(row)"></el-button-mini>
                </template>
            </table-panel>
        </div>

        <user-add-dialog
                :visible.sync="showAddDialog"
                :user-id="editId"
                @finish="editDialogFinish"
        >
        </user-add-dialog>
        <echarts-panel 
        :visible.sync="chartsVisible" 
        ></echarts-panel>
    </div>
</template>

<script>
    import SearchCardLayout from "@/components/layout-component/SearchCardLayout";
    import ElButtonMini from "@/components/common/button/ElButtonMini";
    import ElButtonCurdGroup from "@/components/common/button/ElButtonCurdGroup";
    import TablePanel from "@/components/layout-component/TablePanel";
    import Api from "@/assets/api/Api";
    import PaginateModel from "@/project/model/PaginateModel";
    import EcUtil from "@/util/EcUtil";
    import UserAddDialog from "@/components/page-content/user/dialog/UserAddDialog";
    import DialogUtil from "@/util/DialogUtil";
    import UserModel from "@/project/model/UserModel";
    import RoleSelector from "@/components/page-content/enum-selector/RoleSelector";
    import EchartsPanel from "./EchartsPanel"
    export default {
        name: "UserManagerView",
        components: {RoleSelector, UserAddDialog, TablePanel, ElButtonCurdGroup, ElButtonMini, SearchCardLayout,EchartsPanel},
        props: {},
        data() {
            return {
                loading: true,
                showAddDialog: false,
                filterForm: new UserModel(),
                data: [],
                paginate: new PaginateModel(this.refreshData),
                selectedRow: [],
                sortingColumn: null,
                editId: 0,
                chartsVisible: false
            }
        },
        mounted() {
            this.reload();
        },
        methods: {
            showEcharts(){
                this.chartsVisible = true;
            },
            reload() {
                this.refreshData();
            },
            refreshData() {
                this.loading = true;
                this.$ajax.request(Api.user.list, {
                    ...this.filterForm,
                    ...this.paginate.getJSON(),
                    ...EcUtil.getSortField(this.sortingColumn)
                }).then(resp => {
                    this.data = resp.list.map(item =>{
                        item.itemName = "物料名称";
                        return item;
                    });
                    this.paginate.setPaginate(resp);
                }).finally(() => this.loading = false)
            },

            sortChange(column) {
                this.sortingColumn = column;
                this.$nextTick(() => this.refreshData());
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
                this.deleteRows(this.selectedRow);
            },
            deleteRows(nodes) {
                DialogUtil.confirm(`
                    确定要删除以下用户？ <br>
                    [ ${nodes.map(x => x.userName).join(',')} ]
                `).then(() => {
                    return this.$ajax.request(Api.user.remove, {
                        ids: nodes.map(x => x.id).join(',')
                    })
                }).then(resp => {
                    DialogUtil.toastSuccess(resp);
                    this.refreshData();
                })
            },
            editDialogFinish() {
                this.refreshData();
            },
            clickRowEdit(row) {
                this.editId = row.id
                this.showAddDialog = true;
            },
            clickRowDelete(row) {
                this.deleteRows([row])
            }
        },
        watch: {},
        computed: {},

    }
</script>

<style lang="less" scoped>
    @import (reference) "~style/all.less";

    .UserManagerView {
    }
</style>