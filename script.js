document.addEventListener('DOMContentLoaded', () => {

  /* ---------- HEADER: efecto on-scroll ---------- */
  const header = document.getElementById('mainHeader');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  /* ---------- HAMBURGER MENU ---------- */
  const hamburgerToggle = document.getElementById('hamburgerToggle');
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  const hamburgerClose = document.getElementById('hamburgerClose');
  const openMenu = () => { hamburgerMenu.classList.add('open'); hamburgerToggle.setAttribute('aria-expanded', 'true'); };
  const closeMenu = () => { hamburgerMenu.classList.remove('open'); hamburgerToggle.setAttribute('aria-expanded', 'false'); };
  if (hamburgerToggle) hamburgerToggle.addEventListener('click', openMenu);
  if (hamburgerClose) hamburgerClose.addEventListener('click', closeMenu);
  hamburgerMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- REVEAL ON SCROLL (con stagger por grilla) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const applyStagger = (root = document) => {
    root.querySelectorAll('.sucursales-grid, .productos-grid, .menu-catalogo-grid, .tortas-grid, .servicios-grid, .ig-grid').forEach(grid => {
      Array.from(grid.children).forEach((child, i) => {
        child.style.transitionDelay = (i % 4) * 90 + 'ms';
      });
    });
  };
  applyStagger();
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- MENÚ: filtro por categoría ---------- */
  const filterBtns = document.querySelectorAll('.menu-filter');
  const menuItems = document.querySelectorAll('.menu-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      menuItems.forEach(item => {
        const show = filter === 'todos' || item.dataset.cat === filter;
        item.classList.toggle('hidden', !show);
      });
    });
  });

  /* ---------- TORTAS: catálogo con selector de personas ---------- */
  const tortas = [
    {
      nombre: "Torta Bizcocho",
      desc: "Bizcocho de vainilla, manjar y crema chantilly.",
      img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80&auto=format&fit=crop",
      precios: { 8: "$18.000", 16: "$35.000", 22: "$45.000", 30: "$58.000" }
    },
    {
      nombre: "Torta de Chocolate",
      desc: "Bizcocho de cacao, ganache de chocolate y café de autor.",
      img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80&auto=format&fit=crop",
      precios: { 8: "$20.000", 16: "$39.000", 22: "$49.000", 30: "$62.000" }
    },
    {
      nombre: "Torta Panqueque Frambuesa",
      desc: "Capas de panqueque, frambuesa, manjar y chantilly.",
      img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80&auto=format&fit=crop",
      precios: { 8: "$19.000", 16: "$37.000", 22: "$47.000", 30: "$60.000" }
    }
  ];

  const tortasGrid = document.getElementById('tortasGrid');
  if (tortasGrid) {
    tortas.forEach((t, idx) => {
      const cantidades = Object.keys(t.precios);
      const card = document.createElement('div');
      card.className = 'torta-card reveal';
      card.innerHTML = `
        <div class="torta-img" style="background-image:url('${t.img}')"></div>
        <div class="torta-body">
          <div class="torta-name">${t.nombre}</div>
          <div class="torta-desc">${t.desc}</div>
          <div class="torta-qty" data-idx="${idx}">
            ${cantidades.map((c, i) => `<button class="${i === 0 ? 'selected' : ''}" data-qty="${c}">${c} pers.</button>`).join('')}
          </div>
          <div class="torta-price-row">
            <div class="torta-price" id="torta-price-${idx}">${t.precios[cantidades[0]]}</div>
          </div>
          <div class="producto-actions" style="margin-top:12px;">
            <button class="btn-detalle" data-torta-detalle="${idx}">Ver detalle</button>
            <button class="btn-add-cart torta-add"><i class="fab fa-whatsapp"></i> Cotizar por WhatsApp</button>
          </div>
        </div>
      `;
      tortasGrid.appendChild(card);
      io.observe(card);
    });
    applyStagger(tortasGrid.parentElement);

    document.addEventListener('click', (e) => {
      if (e.target.matches('.torta-qty button')) {
        const wrap = e.target.closest('.torta-qty');
        const idx = wrap.dataset.idx;
        wrap.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        const qty = e.target.dataset.qty;
        document.getElementById('torta-price-' + idx).textContent = tortas[idx].precios[qty];
      }
      if (e.target.closest('.torta-add')) {
        const card = e.target.closest('.torta-card');
        const nombre = card.querySelector('.torta-name').textContent;
        const precio = card.querySelector('.torta-price').textContent;
        const url = `https://wa.me/56962045682?text=${encodeURIComponent(`Hola, quiero cotizar la ${nombre} (${precio}).`)}`;
        window.open(url, '_blank');
      }
      if (e.target.matches('[data-torta-detalle]')) {
        const t = tortas[e.target.dataset.tortaDetalle];
        openProductModal({ name: t.nombre, price: Object.values(t.precios)[0] + ' desde', img: t.img, desc: t.desc, contains: 'Pedidos con 48h de anticipación. Precio varía según cantidad de personas seleccionada.' }, false);
      }
    });
  }

  /* ---------- TIENDA COCÓ: catálogo con carrito ---------- */
  const tiendaProductos = [
    { id: 'cafe-bolivia', cat: 'cafe', origen: 'Bolivia', nombre: 'Caranavi 250g', precio: 8900, img: 'https://images.unsplash.com/photo-1587734195503-904fca47e0b9?w=600&q=80&auto=format&fit=crop', desc: 'Café de origen Caranavi, tueste medio, notas a panela y frutos rojos. Tostado semanalmente en nuestra tostaduría.', contains: 'Formato: grano o molido, 250g. Conservar en lugar fresco y seco.' },
    { id: 'cafe-brasil', cat: 'cafe', origen: 'Brasil', nombre: 'Cerrado 250g', precio: 8200, img: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80&auto=format&fit=crop', desc: 'Café de origen Cerrado, tueste medio-oscuro, cuerpo intenso y notas a chocolate y nuez.', contains: 'Formato: grano o molido, 250g. Conservar en lugar fresco y seco.' },
    { id: 'cafe-colombia', cat: 'cafe', origen: 'Colombia', nombre: 'Huila 250g', precio: 9500, img: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&q=80&auto=format&fit=crop', desc: 'Café de origen Huila, tueste claro-medio, acidez cítrica brillante y notas florales.', contains: 'Formato: grano o molido, 250g. Conservar en lugar fresco y seco.' },
    { id: 'cafe-costarica', cat: 'cafe', origen: 'Costa Rica', nombre: 'Tarrazú 250g', precio: 9900, img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80&auto=format&fit=crop', desc: 'Café de origen Tarrazú, tueste medio, dulzor a caramelo y final limpio.', contains: 'Formato: grano o molido, 250g. Conservar en lugar fresco y seco.' },
    { id: 'merch-taza', cat: 'merch', origen: 'Merchandising', nombre: 'Taza Cocó Café', precio: 6500, img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80&auto=format&fit=crop', desc: 'Taza de cerámica 300ml con el logo de Cocó Café, apta para microondas y lavavajillas.', contains: 'Material: cerámica. Capacidad: 300ml.' },
    { id: 'merch-polera', cat: 'merch', origen: 'Merchandising', nombre: 'Polera Cocó Café', precio: 12900, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&auto=format&fit=crop', desc: 'Polera de algodón orgánico con estampado del logo Cocó Café. Disponible en tallas S a XL.', contains: 'Material: 100% algodón. Tallas: S, M, L, XL.' },
    { id: 'merch-bolsa', cat: 'merch', origen: 'Merchandising', nombre: 'Bolsa de Tela Cocó', precio: 5900, img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80&auto=format&fit=crop', desc: 'Bolsa de tela reutilizable, ideal para tus compras de café en grano y pastelería.', contains: 'Material: algodón grueso. Medidas: 38x42cm.' }
  ];

  const tiendaGrid = document.getElementById('tiendaGrid');
  const renderTienda = (filter = 'todos') => {
    if (!tiendaGrid) return;
    tiendaGrid.innerHTML = tiendaProductos
      .filter(p => filter === 'todos' || p.cat === filter)
      .map(p => `
        <div class="producto-card reveal visible" data-id="${p.id}">
          <div class="producto-img" style="background-image:url('${p.img}')"></div>
          <div class="producto-body">
            <div class="producto-origen">${p.origen}</div>
            <div class="producto-name">${p.nombre}</div>
            <div class="producto-price">$${p.precio.toLocaleString('es-CL')}</div>
            <div class="producto-actions">
              <button class="btn-detalle" data-tienda-detalle="${p.id}">Ver detalle</button>
              <button class="btn-add-cart" data-tienda-add="${p.id}">Agregar</button>
            </div>
          </div>
        </div>
      `).join('');
  };
  renderTienda();

  document.querySelectorAll('[data-tienda-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-tienda-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTienda(btn.dataset.tiendaFilter);
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-tienda-detalle]')) {
      const p = tiendaProductos.find(x => x.id === e.target.dataset.tiendaDetalle);
      openProductModal({ name: p.nombre, price: '$' + p.precio.toLocaleString('es-CL'), img: p.img, desc: p.desc, contains: p.contains }, true, p.id);
    }
    if (e.target.matches('[data-tienda-add]')) {
      addToCart(e.target.dataset.tiendaAdd);
    }
  });

  /* ---------- MODAL DE DETALLE (menú y tienda) ---------- */
  const productModalOverlay = document.getElementById('productModalOverlay');
  const productModalImg = document.getElementById('productModalImg');
  const productModalName = document.getElementById('productModalName');
  const productModalPrice = document.getElementById('productModalPrice');
  const productModalDesc = document.getElementById('productModalDesc');
  const productModalContains = document.getElementById('productModalContains');
  const productModalAddBtn = document.getElementById('productModalAddBtn');
  const productModalClose = document.getElementById('productModalClose');

  function openProductModal(data, showAddBtn, tiendaId) {
    productModalImg.style.backgroundImage = `url('${data.img}')`;
    productModalName.textContent = data.name;
    productModalPrice.textContent = data.price;
    productModalDesc.textContent = data.desc;
    productModalContains.textContent = data.contains;
    productModalAddBtn.style.display = showAddBtn ? 'flex' : 'none';
    productModalAddBtn.onclick = () => { addToCart(tiendaId); closeProductModal(); };
    productModalOverlay.classList.add('open');
  }
  function closeProductModal() { productModalOverlay.classList.remove('open'); }
  productModalClose.addEventListener('click', closeProductModal);
  productModalOverlay.addEventListener('click', (e) => { if (e.target === productModalOverlay) closeProductModal(); });

  document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-detalle[data-name]')) {
      const d = e.target.dataset;
      openProductModal({ name: d.name, price: d.price, img: d.img, desc: d.desc, contains: d.contains }, false);
    }
  });

  /* ---------- TOAST ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  /* ---------- CARRITO: lógica real con localStorage ---------- */
  let cart = JSON.parse(localStorage.getItem('cocoCart') || '[]');

  function saveCart() { localStorage.setItem('cocoCart', JSON.stringify(cart)); }

  function addToCart(id) {
    const p = tiendaProductos.find(x => x.id === id);
    if (!p) return;
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id: p.id, nombre: p.nombre, precio: p.precio, img: p.img, qty: 1 });
    saveCart();
    renderCart();
    showToast(`${p.nombre} agregado al carrito`);
    cartCount.classList.remove('bump'); void cartCount.offsetWidth; cartCount.classList.add('bump');
  }

  function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
  }

  const cartDrawerBody = document.getElementById('cartDrawerBody');
  const cartCount = document.getElementById('cartCount');
  const cartSubtotalRow = document.getElementById('cartSubtotalRow');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');

  function renderCart() {
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
      cartDrawerBody.innerHTML = '<p class="cart-empty">Tu carrito está vacío. Agrega café en grano o merchandising desde la Tienda Cocó.</p>';
      cartSubtotalRow.style.display = 'none';
      return;
    }

    cartDrawerBody.innerHTML = cart.map(i => `
      <div class="cart-item" data-id="${i.id}">
        <div class="cart-item-img" style="background-image:url('${i.img}')"></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${i.nombre}</div>
          <div class="cart-item-price">$${(i.precio * i.qty).toLocaleString('es-CL')}</div>
          <div class="cart-item-qty">
            <button data-qty-minus="${i.id}">−</button>
            <span>${i.qty}</span>
            <button data-qty-plus="${i.id}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-remove="${i.id}" aria-label="Quitar"><i class="fas fa-trash"></i></button>
      </div>
    `).join('');

    const subtotal = cart.reduce((s, i) => s + i.precio * i.qty, 0);
    cartSubtotal.textContent = '$' + subtotal.toLocaleString('es-CL');
    cartSubtotalRow.style.display = 'flex';

    const mensaje = 'Hola, quiero comprar:\n' + cart.map(i => `• ${i.nombre} x${i.qty} — $${(i.precio * i.qty).toLocaleString('es-CL')}`).join('\n') + `\n\nSubtotal: $${subtotal.toLocaleString('es-CL')}`;
    cartCheckoutBtn.href = `https://wa.me/56962045682?text=${encodeURIComponent(mensaje)}`;
    cartCheckoutBtn.target = '_blank';
  }
  renderCart();

  cartDrawerBody.addEventListener('click', (e) => {
    if (e.target.matches('[data-qty-plus]')) changeQty(e.target.dataset.qtyPlus, 1);
    if (e.target.matches('[data-qty-minus]')) changeQty(e.target.dataset.qtyMinus, -1);
    if (e.target.closest('[data-remove]')) removeFromCart(e.target.closest('[data-remove]').dataset.remove);
  });

  /* ---------- FAQ acordeón ---------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- CARRITO drawer (vista previa) ---------- */
  const cartBtn = document.getElementById('cartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartClose = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');
  const openCart = () => { cartDrawer.classList.add('open'); cartOverlay.classList.add('open'); };
  const closeCart = () => { cartDrawer.classList.remove('open'); cartOverlay.classList.remove('open'); };
  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  /* ---------- RESERVAS: formulario -> WhatsApp ---------- */
  const reservaForm = document.getElementById('reservaForm');
  if (reservaForm) {
    reservaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(reservaForm);
      const nombre = data.get('nombre');
      const telefono = data.get('telefono');
      const sucursal = data.get('sucursal');
      const fecha = data.get('fecha');
      const personas = data.get('personas');
      const evento = data.get('evento');

      if (Number(personas) > 50) {
        alert('El máximo de personas por evento es 50. Ajusta la cantidad para continuar.');
        return;
      }

      const mensaje = `Hola, quiero reservar un evento en Cocó Café:
Nombre: ${nombre}
Teléfono: ${telefono}
Sucursal: ${sucursal}
Fecha: ${fecha}
Cantidad de personas: ${personas}
Tipo de evento: ${evento}`;

      const numeroSucursal = {
        'La Marina': '56962045682',
        'Sexta Avenida': '56983811484',
        'El Llano': '56964519428'
      }[sucursal] || '56962045682';

      const url = `https://wa.me/${numeroSucursal}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    });
  }

  /* ---------- CONTACTO: formulario simple (feedback visual) ---------- */
  const contactoForm = document.querySelector('.contacto-form');
  if (contactoForm) {
    contactoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Gracias por escribirnos! Te responderemos a la brevedad.');
      contactoForm.reset();
    });
  }

});