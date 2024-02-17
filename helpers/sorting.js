function sorting(query) {

    const sortBy = query.sortBy || '_id';
    const sortType = query.sortType || 'desc';
    const sort = { [sortBy]: sortType };
    return sort
}

module.exports = sorting;