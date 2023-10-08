const _ = require("lodash");

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
  const authorCounts = _.countBy(blogs, "author");
  const mostAuthor = Object.keys(authorCounts).reduce((most, author) => {
    if (authorCounts[author] > authorCounts[most]) {
      return author;
    }
    return most;
  }, Object.keys(authorCounts)[0]);

  return mostAuthor
    ? { author: mostAuthor, blogs: authorCounts[mostAuthor] }
    : null;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
