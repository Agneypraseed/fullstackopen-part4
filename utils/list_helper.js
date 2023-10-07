const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs.reduce((max, current) => {
        return current.likes > max.likes ? current : max;
      }, blogs[0]);
};

const mostBlogs = (blogs) => {
  const namestoCountMap = [];
  blogs.forEach((item) => {
    if (item.author) {
      const existingName = namestoCountMap.find(
        (entry) => entry.author === item.author
      );
      if (existingName) {
        existingName.blogs += 1;
      } else {
        namestoCountMap.push({ author: item.author, blogs: 1 });
      }
    }
  });
  return namestoCountMap.length === 0
    ? null
    : namestoCountMap.reduce((max, current) => {
        return current.blogs > max.blogs ? current : max;
      }, namestoCountMap[0]);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
