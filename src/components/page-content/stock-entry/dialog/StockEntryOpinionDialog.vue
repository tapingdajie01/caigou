<template>
    <div class="StockEntryOpinionDialog">
        <el-dialog

                :visible="visible"
                @update:visible="showDialog"

                width="400px"
                title="请填写批准意见"
        >
            <el-form
                    label-position="top"
            >
                <el-form-item label="单号">
                    <el-input :value="form.number" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item  label="批准意见" :required="true">
                    <el-input  type="textarea" v-model="stockEntry.leaderSuggest" :autosize="{ minRows: 4, maxRows: 10}"></el-input>

                </el-form-item>
            </el-form>
            <div class="" >

                    <el-button-submit
                        style="width: 100px"
                        @click.native="toWriteBoard"
                >签字
                </el-button-submit>

                <el-button-submit
                        style="width: 150px"
                        @click.native="submit"
                        :loading="loading"
                >提交意见

                </el-button-submit>
            </div>
        </el-dialog>
         
        <el-dialog
            :visible.sync="writeBoardvisible"
            :before-close="handleClose"
            title="签字内容"
        >
        <div v-if="writeBoardvisible" style="width:800px; height:600px;">
            
            <iframe ref="myFrame" src="http://localhost:8092/" width="100%"  height=100%  frameborder="0" class="iframe"></iframe>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span> -->
        </div>
        </el-dialog>
    </div>
</template>

<script>
    import StockEntryModel from "@/project/model/StockEntryModel";
    import ElButtonSubmit from "@/components/common/button/ElButtonSubmit";
    import Api from "@/assets/api/Api";
    import DialogUtil from "@/util/DialogUtil";
    //import WriteBoard from "@/components/page-content/stock-entry/dialog/WriteBoard";

    export default {
        name: "StockEntryOpinionDialog",
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
                form: Object.assign({}, this.stockEntry),
                loading: false,
                writeBoardvisible: false,
                bmpUrl:''
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

                this.form.status = 3;
                this.form.bmpUrl = this.bmpUrl;
                this.form.leaderSuggest = this.stockEntry.leaderSuggest;
                this.$ajax.request(Api.stockEntry.approve, this.form).then(resp => {
                    DialogUtil.toastSuccess(resp);
                    this.showDialog(false);
                    this.$emit('finish');
                }).finally(() => this.loading = false)
            },
            toWriteBoard () {
                this.writeBoardvisible = true
            },
            handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
              window.iframe[0].postMessage("message","*");
            done();
          })
          .catch(_ => {});
      }
        },
        watch: {
            visible(v) {
                if (v) {
                    this.form = Object.assign({}, this.stockEntry);
                }
            }
        },
        computed: {},
        created() {
            window.addEventListener(
              "message",
              (e) => {
                this.bmpUrl = e.data
                this.writeBoardvisible = false
                DialogUtil.toastSuccess("审核完成！");
              },
              false
            );
        
          },
    }
</script>

<style lang="less" scoped>
    @import (reference) "~style/all.less";

    .StockEntryOpinionDialog {
    }
</style>