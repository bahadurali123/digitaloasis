// pagination Middleware
const paginateMiddleware = async (req, res, next) => {
    try {
      const pageno = req.query.page || 1;
      // console.log("pageno", pageno);
      const limit = 8;
      const skipblog = (pageno - 1) * limit;
      // console.log("skip blogs: ", skipblog);
  
      // Adding pagination data to request object
      req.paginationData = {
        pageno,
        limit,
        skipblog,
        // totalpages,
      };
  
      next();
    } catch (error) {
      console.error("Pagination Middleware Error:", error);
      res.status(500).send("Internal Server Error");
    }
  };

module.exports = paginateMiddleware;