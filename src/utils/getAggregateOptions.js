const getAggregateOptions = (queryParams) => {
  let pagination = {
    page: 1,
    size: 20,
  };

  // Handle pagination-related parameters directly
  if (queryParams.page) {
    const page = parseInt(queryParams.page, 10);
    pagination.page = page > 0 ? page : 1;
  }

  if (queryParams.size) {
    const size = parseInt(queryParams.size, 10);
    pagination.size = size > 0 ? size : 20;
  }

  // Construct the final options object focusing on pagination and sorting
  const options = {
    page: pagination.page,
    size: pagination.size,
    sort: {
      $sort: { createdAt: -1 }, // Default sorting by 'createdAt' in descending order
    },
    skip: {
      $skip: (pagination.page - 1) * pagination.size, // Calculate skip for pagination
    },
    limit: {
      $limit: pagination.size, // Limit results per page
    },
  };

  return options;
};

module.exports = getAggregateOptions;
