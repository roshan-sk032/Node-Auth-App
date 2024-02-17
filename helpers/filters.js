const { query } = require("express")

function filter(query) {

    const {first_name, last_name, username, email, user_type} = query
    query = {}
    if (first_name) {
        query.first_name = RegExp(first_name, 'i')
    }
    if (last_name) {
        query.last_name = RegExp(last_name, 'i')
    }
    if (username) {
        query.username = RegExp(username, 'i')
    }
    if (email) {
        query.email = RegExp(email, 'i')
    }
    if (user_type) {
        query.user_type = user_type
    }
    return query
}


function taskFilter(query) {
    const {title} = query
    query = {}
    if (title) {
        query.title = RegExp(title, 'i')
    }
    return query

}

module.exports = {filter, taskFilter};