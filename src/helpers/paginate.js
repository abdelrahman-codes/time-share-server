async function paginate(model, query = {}, options = {}) {
  const { page = 1, limit = 10, sort = '-createdAt', select = '' } = options;

  // Ensure page and limit are valid numbers
  const currentPage = Math.max(1, parseInt(page));
  const itemsPerPage = Math.max(1, parseInt(limit));

  // Calculate total documents and total pages
  const totalItems = await model.countDocuments(query);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Fetch the paginated result
  const result = await model
    .find(query)
    .select(select)
    .sort(sort)
    .skip((currentPage - 1) * itemsPerPage)
    .limit(itemsPerPage);

  // Return paginated response
  return {
    meta: {
      totalItems,
      itemsPerPage,
      totalPages,
      currentPage,
    },
    result,
  };
}

module.exports = paginate;
