<template>
    <div class="DashBoardNeedList">
        <el-card shadow="always" style="">
            <!-- <div class="mb-xs">奇趣资源优选 版权所有 侵权必究</div>
            <div>
                <div class="" ref="" style="height: 400px;overflow-y:auto;">
                    <ul>
                        <li>
                            <a href="https://shop379896684.taobao.com" style="color: red;" target="_blank">授权店铺购买源码</a>
                        </li>
                    </ul>
                </div>
            </div> -->
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "DashBoardNeedList",
        components: {},
        props: {},
        data() {
            return {}
        },
        mounted() {
            this.reload();
        },
        methods: {
            reload() {
            },
        },
        watch: {},
        computed: {},

    }
</script>

<style lang="less" scoped>
    @import (reference) "~style/all.less";

    .DashBoardNeedList {
        .list-li{
            margin-top: 0;
            list-style-type: decimal;
            li {
                padding: 5px 0;
                .link-to {
                    padding: 0 2px;
                    color: @color--blue;
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
        }
    }
</style>