<template>
    <div class="StockEntryDeliveryFinishDialog">
        <el-dialog
                :visible="visible"
                @update:visible="showDialog"
                width="60%"
                title="打印出库单"
        >
            <div class="text-right mt-sm">
                <el-button-submit
                        :is-block="false"
                        :loading="loading"
                        @click.native="submit"
                >打印
                </el-button-submit>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import StockEntryModel from "@/project/model/StockEntryModel";
    import ElButtonSubmit from "@/components/common/button/ElButtonSubmit";
    import Api from "@/assets/api/Api";
    import DialogUtil from "@/util/DialogUtil";

    export default {
        name: "printerDialog",
        components: {ElButtonSubmit},
        props: {
            visible: {
                default: false
            },
            stockEntry: {
                default() {
                    return new StockEntryModel()
                }
            }
        },
        data() {
            return {
                loading: false,
            }
        },
        mounted() {
            this.reload();
        },
        methods: {
            reload() {
            },
            showDialog(v) {
                this.$emit('update:visible', v);
            },
            submit() {
                this.loading = true;
                
            }
        },
    }
</script>

<style lang="less" scoped>
    @import (reference) "~style/all.less";
</style>