async function paginateAggregate(model, pipeline = [], options = {}) {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;

  // Ensure page and limit are valid numbers
  const currentPage = Math.max(1, parseInt(page));
  const itemsPerPage = Math.max(1, parseInt(limit));

  // Add sort stage to pipeline
  if (sort) {
    pipeline.push({ $sort: sort });
  }

  // Add pagination stages to pipeline
  const skipStage = { $skip: (currentPage - 1) * itemsPerPage };
  const limitStage = { $limit: itemsPerPage };
  pipeline.push(skipStage, limitStage);

  // Count total documents using a cloned pipeline
  const countPipeline = [...pipeline];
  countPipeline.push({ $group: { _id: null, totalItems: { $sum: 1 } } });

  // Execute both aggregation pipelines
  const [results, countResult] = await Promise.all([
    model.aggregate(pipeline),
    model.aggregate(countPipeline),
  ]);

  // Extract totalItems
  const totalItems = countResult.length > 0 ? countResult[0].totalItems : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Return paginated response
  return {
    meta: {
      totalItems,
      itemsPerPage,
      totalPages,
      currentPage,
    },
    result: results,
  };
}

module.exports = paginateAggregate;
