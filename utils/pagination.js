function paginate(page, pageSize) {
    const skip = (page - 1) * pageSize;
    return skip;
}

function paginateArray(array, page, pageSize) {
    const startIndex = (page - 1) * pageSize;  // Calculate the starting index
    const endIndex = page * pageSize;          // Calculate the ending index
    const paginatedItems = array.slice(startIndex, endIndex); // Use slice to get the desired items

    return paginatedItems
}

module.exports = {
    paginate,
    paginateArray,
};
