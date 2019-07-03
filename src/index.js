const imageURL = `https://randopic.herokuapp.com/images/2898`

const likeURL = `https://randopic.herokuapp.com/likes/`

const commentsURL = `https://randopic.herokuapp.com/comments/`

const comments = document.querySelector('#comments')

document.addEventListener('DOMContentLoaded', () => {
  
  fetchImage()
  likeListener()
  submitComment()
  deleteListener()
})

function deleteListener(){
  comments.addEventListener("click", e => clickDelete(e))
}

function clickDelete(e){
  if (e.target.dataset.id){
    const id = e.target.dataset.id
    e.target.parentNode.remove()
    deleteComment(id)
  }
}

function deleteComment(id){
  //there is CORS error from deleting from the API. Have to go into config to add delete
  fetch(`commentsURL/${id}`, {method: "DELETE"})
  .then(resp => resp.json())
  .then(data => console.log(data))
}


function submitComment(){
  const submitBtn = document.querySelector('#submit')
  submitBtn.addEventListener("click", e => renderComments(e))
}

function renderComments(e){
  e.preventDefault()

  const li = document.createElement('li')
  const comment = e.target.previousSibling.previousSibling.value
  li.innerText = comment
  const deleteComment = document.createElement('button')
  deleteComment.dataset.id = comment.id
  deleteComment.innerText = "Delete"
  li.append(deleteComment)
  comments.append(li)
  postComment(comment)
}

function postComment(comment){
  let configObj = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_id: 2898,
      content: comment
    })
  }

  fetch(commentsURL, configObj)
  .then(resp => resp.json())
  .then(data => console.log(data))
}

function likeListener(){
  const like = document.querySelector('#like_button')
  like.addEventListener("click", e => addLike(e))
}


function addLike(e){
  
  const liked = parseInt(e.target.previousSibling.previousSibling.innerText.match(/\d+/g)[0])
  const like = liked + 1
  e.target.previousSibling.previousSibling.innerText = `Likes: ${like}`
  postLike()
}

function postLike(){
  let configObj = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_id: 2898
    })
  }

  fetch(likeURL, configObj)
  .then(resp => resp.json())
  .then(data => console.log(data))
}



function fetchImage(){
  fetch(imageURL)
  .then(resp => resp.json())
  .then(data => renderImage(data))
}

function renderImage(data){
  const img = document.querySelector('#image')
  const name = document.querySelector('#name')
  const likes = document.querySelector('#likes')
  
  img.src = data.url
  name.innerHTML = data.name
  likes.innerHTML = data.like_count
  data.comments.forEach(comment => {
    const li = document.createElement('li')
    li.innerText = comment.content
    const deleteComment = document.createElement('button')
    deleteComment.dataset.id = comment.id
    deleteComment.innerText = "Delete"
    li.append(deleteComment)
    comments.append(li)
  });
}