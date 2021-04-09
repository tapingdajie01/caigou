export default {

<<<<<<< .mine
    domain: process.env.NODE_ENV == 'development' ? 'http://wms.fangjc1986.com:9102/' : 'http://49.233.51.111:9102/',
||||||| .r190
    domain: process.env.NODE_ENV !== 'development' ? 'http://wms.fangjc1986.com:9102/' : 'http://172.20.10.7:9102/',
=======
    domain: process.env.NODE_ENV !== 'development' ? 'http://wms.fangjc1986.com:9102/' : 'http://localhost:9102/',
>>>>>>> .r236
    domainName: '仓储管理系统',

}