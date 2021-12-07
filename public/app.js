const toCurrency = (price) =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(price)

document.querySelectorAll('.price').forEach((node) => {
  node.textContent = toCurrency(node.textContent)
})

const cartNode = document.querySelector('#cart')

if (cartNode) {
  cartNode.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('js-remove')) {
      const id = evt.target.dataset.id
      fetch(`/cart/delete/${id}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((cart) => {
          if (cart.courses.length) {
            const html = cart.courses
              .map(
                ({ id, title, count }) => `
            <tr>
              <td>${title}</td>
              <td>${count}</td>
              <td>
                <button class='btn btm-small js-remove' data-id='${id}'>Delete</button>
              </td>
            </tr>
            `
              )
              .join('')
            cartNode.querySelector('tbody').innerHTML = html
            cartNode.querySelector('.price').textContent = toCurrency(cart.totalPrice)
          } else {
            cartNode.innerHTML = `<p>Cart is empty</p>`
          }
        })
    }
  })
}
