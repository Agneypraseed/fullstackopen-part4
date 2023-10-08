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

const mostBlogs = (arr) => {
  if (arr.length === 0) return null;
  const { author, blogs } = arr.reduce(
    (acc, blog) => {
      const author = blog.author;
      acc[author] = (acc[author] || 0) + 1;

      if (acc[author] > acc.blogs) {
        acc.blogs = acc[author];
        acc.author = author;
      }
      return acc;
    },
    { blogs: 0, author: null }
  );
  return { author, blogs };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
