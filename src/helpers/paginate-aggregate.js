async function paginateAggregate(model, pipeline = [], options = {}) {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;

  // Ensure page and limit are valid numbers
  const currentPage = Math.max(1, parseInt(page));
  const itemsPerPage = Math.max(1, parseInt(limit));

  // Clone pipeline to avoid modifying the original reference
  const paginatedPipeline = [...pipeline];

  // Add sort stage to the paginated pipeline
  if (sort) {
    paginatedPipeline.push({ $sort: sort });
  }

  // Add pagination stages
  paginatedPipeline.push({ $skip: (currentPage - 1) * itemsPerPage }, { $limit: itemsPerPage });

  // Create a separate count pipeline (without pagination)
  const countPipeline = [...pipeline, { $count: 'totalItems' }];

  // Execute both aggregation pipelines
  const [results, countResult] = await Promise.all([model.aggregate(paginatedPipeline), model.aggregate(countPipeline)]);

  // Extract totalItems safely
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
