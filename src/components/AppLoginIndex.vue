<style scoped>
.AppLoginIndex{
    background:url(./bg_index.jpg) no-repeat;
    background-size: 100% 100%;
    height: 100%;
    width: 100%;
    padding-top: 100px;
    box-sizing: border-box;  
}
</style>
<template>
    <div class="AppLoginIndex">
        <login-dialog
            :visible="true"
        ></login-dialog>
    </div>
</template>

<script>
    import LoginDialog from "@/components/common/LoginDialog";
    export default {
        name: "AppLoginIndex",
        components: {LoginDialog},
        props: {},
        data() {
            return {}
        },
        mounted() {
            this.reload();
        },
        activated() {
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
    @import (reference) "~@/style/all.less";

    .AppLoginIndex {
    }
</style>