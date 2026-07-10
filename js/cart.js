
function getCart(){ return JSON.parse(localStorage.getItem('siftedCart') || '[]'); }
function saveCart(cart){ localStorage.setItem('siftedCart', JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){
  const count = getCart().reduce((sum,item)=>sum + (item.qty || 1),0);
  document.querySelectorAll('#cart-count').forEach(el=>el.textContent=count);
}
function addToCart(item){
  const cart = getCart();
  const existing = cart.find(x=>x.id===item.id);
  if(existing){ existing.qty += 1; } else { cart.push({...item, qty:1}); }
  saveCart(cart);
  alert(item.name + " added to cart.");
}
document.addEventListener('click', function(e){
  const btn = e.target.closest('.add-to-cart');
  if(btn){
    addToCart({
      id:btn.dataset.id,
      name:btn.dataset.name,
      price:Number(btn.dataset.price),
      image:btn.dataset.image,
      url:btn.dataset.url
    });
  }
  if(e.target && e.target.id === 'clear-cart'){
    localStorage.removeItem('siftedCart');
    updateCartCount();
    renderCart();
  }
  const remove = e.target.closest('.remove-cart-item');
  if(remove){
    const id = remove.dataset.id;
    const cart = getCart().filter(x=>x.id!==id);
    saveCart(cart);
    renderCart();
  }
});
function renderCart(){
  const holder = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if(!holder) return;
  const cart = getCart();
  if(cart.length === 0){
    holder.innerHTML = '<p class="lead">Your cart is empty.</p><div class="actions"><a class="button secondary" href="discoveries.html">Return to Discoveries</a></div>';
    if(totalEl) totalEl.textContent = '$0';
    return;
  }
  holder.innerHTML = cart.map(item=>`
    <article class="cart-row">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3><a href="${item.url}">${item.name}</a></h3>
        <p>Quantity: ${item.qty}</p>
        <p><strong>$${(item.price * item.qty).toLocaleString()}</strong></p>
        <button class="button secondary remove-cart-item" data-id="${item.id}">Remove</button>
      </div>
    </article>
  `).join('');
  const total = cart.reduce((sum,item)=>sum + item.price * item.qty,0);
  if(totalEl) totalEl.textContent = '$' + total.toLocaleString();
}
document.addEventListener('DOMContentLoaded', function(){
  updateCartCount();
  renderCart();
});
