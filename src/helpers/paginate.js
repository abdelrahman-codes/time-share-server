async function paginate(model, query = {}, options = {}) {
  const { page = 1, limit = 10, sort = '-createdAt', select = '' } = options;

  // Ensure page and limit are valid numbers
  const currentPage = Math.max(1, parseInt(page));
  const pageSize = Math.max(1, parseInt(limit));

  // Calculate total documents and total pages
  const total = await model.countDocuments(query);
  const totalPages = Math.ceil(total / pageSize);

  // Fetch the paginated result
  const result = await model
    .find(query)
    .select(select)
    .sort(sort)
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize);

  // Return paginated response
  return {
    total,
    totalPages,
    currentPage,
    result,
  };
}

module.exports = paginate;
