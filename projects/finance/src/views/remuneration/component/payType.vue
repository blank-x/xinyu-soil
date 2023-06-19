<template>
    <div>
        <div>{{ !row.signStatus ? '------' : row.payTypeDesc}}</div>
        <a class="aLink link" v-if=" row.signStatus    && row.copyrightId"
           :href="$options.filters.createCopyrightUrl( row.copyrightId)" target="_blank">查看版权</a>
    </div>

</template>

<script>
    export default {
        props: {
            row: {
                type: Object,
                default: []
            },
        }
    }
</script>

<style scoped>
    .link:link{
        color: #1aaee5;
    }
    .link:visited{
        color: #1aaee5;
    }
    .link:hover{
        color: #1aaee5;
    }
</style>