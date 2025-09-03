export const dummy = (blogs) => {
  return 1
}

// 4.4
export const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

// 4.5
export const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  
  const favorite = blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  })
  
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

// 4.6 
export const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  
  const authorCounts = {}
  
  blogs.forEach(blog => {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
  })
  
  const topAuthor = Object.keys(authorCounts).reduce((prev, current) => {
    return authorCounts[prev] > authorCounts[current] ? prev : current
  })
  
  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
  }
}

// 4.7
export const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  
  const authorLikes = {}
  
  blogs.forEach(blog => {
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
  })
  
  const topAuthor = Object.keys(authorLikes).reduce((prev, current) => {
    return authorLikes[prev] > authorLikes[current] ? prev : current
  })
  
  return {
    author: topAuthor,
    likes: authorLikes[topAuthor]
  }
}