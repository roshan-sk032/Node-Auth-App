

async function pagination(query,TotalCount){
    let {page=1, limit=10} = query;
    let count = TotalCount
    let totalPages = Math.ceil(count / limit)
    return { page, limit, totalPages};
}


module.exports = pagination;