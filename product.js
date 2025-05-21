document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('detail');
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  if (!id) {
    container.innerHTML = '<p class="text-center text-danger">Өнім ID табылмады.</p>';
    return;
  }

  fetch(`http://localhost:3000/api/products/${id}`)
    .then(r => {
      if (!r.ok) throw new Error(`Қате: ${r.status}`);
      return r.json();
    })
    .then(renderProduct)
    .catch(err => {
      console.error(err);
      container.innerHTML = `<p class="text-center text-danger">Қате: дерек жүктелмеді (${err.message})</p>`;
    });

  function renderProduct(p) {
    container.innerHTML = `
      <div class="row align-items-center">
        <div class="col-md-6">
          <img src="/images/${p.image_url}" alt="${p.name}" class="img-fluid rounded">
        </div>
        <div class="col-md-6">
          <h2>${p.name}</h2>
          <p class="lead">${p.description || 'Сипаттама жоқ'}</p>
          <div class="mb-3">
            <span class="price">${Number(p.price).toLocaleString()} ₸</span>
            ${p.old_price ? `<span class="old">${Number(p.old_price).toLocaleString()} ₸</span>` : ''}
          </div>
          <button class="btn btn-primary btn-lg"
                  data-id="${p.id}"
                  data-name="${p.name}"
                  data-price="${p.price}">
            Себетке қосу
          </button>
        </div>
      </div>
    `;

    // 🔽 Себетке қосу батырмасына оқиға орнату
    const addBtn = container.querySelector('button[data-id]');
    addBtn.addEventListener('click', () => {
      const product = {
        id: p.id,
        name: p.name,
        price: p.price,
        image_url: p.image_url,
        quantity: 1
      };

      import('/js/cart-utils.js').then(module => {
        module.addToCart(product);
        alert('Өнім себетке қосылды!');
      });
    });
  }
});
