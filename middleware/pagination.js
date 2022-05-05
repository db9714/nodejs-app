
module.exports = function paginatedData(model) {
    const myCustomLabels = {
        totalDocs: 'count',
        docs: 'results',
        limit: false,
        page: false,
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: false,
        pagingCounter: false,
        meta: false,
        hasNextPage: false,
        hasPrevPage: false
    };
   
    return (req, res, next) => {
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            customLabels: myCustomLabels,
    
        };
        model.paginate({}, options)
            .then((res1) => {
                // if(res1.next !== null){
                //     let query2 = req.query
                //     query2.page = parseInt(query2.page) + 1;
                //     console.log(query2,req.query,"p")
                //     res1.next = req.headers.host + '/' + new URLSearchParams(query2).toString();
                // }

                // if(res1.prev !== null){
                //     let query = req.query
                //     query.page = parseInt(query.page) - res1.next === null ? 1 :2;
                //     console.log(query,req.query,"o",res1.next === null)

                //     res1.prev = req.headers.host + '/' + new URLSearchParams(query).toString();
                // }
                
                res.paginatedData = res1
                next();
            })
    }
}