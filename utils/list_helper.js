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
  const authorToBlogsCount = {};
  blogs.forEach((item) => {
    if (item.author) {
      authorToBlogsCount[item.author] =
        (authorToBlogsCount[item.author] || 0) + 1;
    }
  });

  const mostAuthor = Object.keys(authorToBlogsCount).reduce((most, author) => {
    if (authorToBlogsCount[author] > authorToBlogsCount[most]) {
      return author;
    }
    return most;
  }, Object.keys(authorToBlogsCount)[0]);

  return mostAuthor
    ? { author: mostAuthor, blogs: authorToBlogsCount[mostAuthor] }
    : null;
};


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
