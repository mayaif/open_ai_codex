import './style.css'
import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
 element.textContent = ''

 loadInterval = setInterval(() => {
  element.textContent += '.'

  if(element.textContent === '....'){
    element.textContent = ''
  }
 }, 300)
}

function typeText(element, text) {
  let index = 0

  let interval = setInterval(() => {
    //if we still typing
    if(index < text.length) {
      element.innerHTML += text.charAt(index)
      index ++
    }else {
      clearInterval(interval)
    }
  }, 20)
}

//generate an unique id for every single message to be able to map over them

function generateUniqueId(){
  const timeStamp = Date.now()
  const randomNumber = Math.random()
  const hexadecimalString = randomNumber.toString(16)

  return `id-${timeStamp}-${hexadecimalString}`
}

function chatStripe(isAi, value, uniqueId){
  return (
    `
    <div class='wrapper ${isAi && 'ai'}'>
      <div class='chat'>
        <div class='profile'>
          <img  
            src="${isAi ? bot : user}"
            alt="${isAi ? 'bot' : 'user'}"
          />
        </div>
        <div class='message' id=${uniqueId}>${value}</div>
      </div>
    </div>
    `
  )
}
// the 'value' from chatStripe func is the ai generated message

const handleSubmit = async(e) => {
  //prevent default behaviour of the browser or reload the browser
  e.preventDefault()

  const data = new FormData(form)

  //generate user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

  // clear textarea input
  form.reset()

  //generate bot's chatstripe
  const uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

  // to be able to scroll down --> put the message in view
  chatContainer.scrollTop = chatContainer.scrollHeight

  //fetch the newly created div
  const messageDiv = document.getElementById(uniqueId)

  loader(messageDiv)
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
  if(e.key === 'Enter') {
    handleSubmit(e)
  }
})

