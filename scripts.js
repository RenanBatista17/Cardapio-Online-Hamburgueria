const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const closeModal = document.getElementById('close-modal-btn')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const cartCount = document.getElementById('cart-count')
const adressInput = document.getElementById('adress')
const adressWarn = document.getElementById('adress-warn')
let cart = []

cartBtn.addEventListener('click', function () {
  updateCartModal()
  cartModal.style.display = 'flex'
})

cartModal.addEventListener('click', function (event) {
  if (event.target == cartModal) {
    cartModal.style.display = 'none'
  }
})

closeModal.addEventListener('click', function () {
  cartModal.style.display = 'none'
})

menu.addEventListener('click', function (event) {
  let buttonParent = event.target.closest('.add-to-cart-btn')

  if (buttonParent) {
    const name = buttonParent.getAttribute('data-name')
    const price = parseFloat(buttonParent.getAttribute('data-price'))
    addToCart(name, price)
  }
})

function addToCart(name, price) {
  const itemExisting = cart.find(item => item.name === name)

  if (itemExisting) {
    itemExisting.quantity += 1
    return
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    })
  }

  updateCartModal()
}

function updateCartModal() {
  cartItemsContainer.innerHTML = ''
  let total = 0

  cart.forEach(item => {
    const cartItemElement = document.createElement('div')
    cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')
    cartItemElement.innerHTML = `
    <div class = "flex items-center justify-between">
      <div>
      <p class = "font-medium">${item.name}</p>
      <p>Qtd: ${item.quantity}</p>
      <p class = "font-normal mt-2">R$ ${item.price.toFixed(2)}</p>
      </div>
      <button class="remove-btn" data-name=${item.name}>Remover</button>
    </div>
    `
    total += item.price * item.quantity
    cartItemsContainer.appendChild(cartItemElement)
  })

  cartCount.innerHTML = cart.length
  cartTotal.textContent = total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

cartItemsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('remove-btn')) {
    const name = event.target.getAttribute('data-name')
    removeItemCart(name)
  }
})

function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name)
  console.log(index)
  if (index !== -1) {
    const itemFind = cart[index]

    if (itemFind.quantity > 1) {
      itemFind.quantity -= 1
      updateCartModal()
      return
    }
    cart.splice(index, 1)
  }
  updateCartModal()
}

adressInput.addEventListener('input', function (event) {
  let inputValue = event.target.value
  if (inputValue !== '') {
    adressWarn.classList.add('hidden')
    adressInput.classList.remove('border-red-500')
  }
})

checkoutBtn.addEventListener('click', function () {
  const isOpen = checkRestaurantOpen()
  if (!isOpen) {
    Toastify({
      text: 'Estamos fechados no momento!',
      duration: 3000,
      close: true,
      gravity: 'top', 
      position: 'right', 
      stopOnFocus: true, 
      style: {
        background: 'red'
      }
    }).showToast()
    return
  }

  if (cart.length === 0) return
  if (adressInput.value === '') {
    adressWarn.classList.remove('hidden')
    adressInput.classList.add('border-red-500')
    return
  }

  const cartItems = cart
    .map(item => {
      return ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
    })
    .join('')

  const message = encodeURIComponent(cartItems)
  const phone = '71983361884'

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}`,
    '_blank'
  )
  cart = []
  updateCartModal()
})

function checkRestaurantOpen() {
  const data = new Date()
  const hora = data.getHours()
  return hora >= 18 && hora < 22
}

const spanItem = document.getElementById('date-span')
const isOpen = checkRestaurantOpen()
if (isOpen) {
  spanItem.classList.remove('bg-red-500')
  spanItem.classList.add('bg-green-600')
} else {
  spanItem.classList.remove('bg-green-600')
  spanItem.classList.add('bg-red-500')
}
