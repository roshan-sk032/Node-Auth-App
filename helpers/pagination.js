const {Users} = require('../models/UserModel')

async function pagination(query,TotalCount){
    let {page=1, limit=5} = query;
    let count = TotalCount
    let totalPages = Math.ceil(count / limit)
    return { page, limit, totalPages};
}


module.exports = pagination;