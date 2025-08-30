export const dummy = (blogs) => {
  return 1
}

// 4.4
export const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}
