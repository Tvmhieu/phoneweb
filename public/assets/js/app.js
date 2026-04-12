// Tải dữ liệu và hiển thị sản phẩm cho trang demo
async function fetchProducts(){
  // Thử dùng dữ liệu inline trước (không cần server)
  if(window.PRODUCTS_DATA){
    return Promise.resolve(window.PRODUCTS_DATA);
  }
  // Dự phòng fetch nếu data-inline.js chưa load
  try{
    const res = await fetch('data/products.json');
    return await res.json();
  }catch(e){
    console.error('Không thể tải dữ liệu sản phẩm', e);
    return [];
  }
}
function qParam(name){
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}
function priceFilterMatch(priceStr, productPrice){
  if(!priceStr) return true;
  // Đã xóa bộ lọc "dưới-1000"
  if(priceStr==='1000-5000') return productPrice>=1000000 && productPrice<=5000000;
  return true;
}
function currency(v){
  if(v===null || v===undefined) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN').format(v)+' đ';
}
function getUniqueProductModels(products){
  // Nhóm sản phẩm theo tên cơ bản (không tính thông tin ROM/dung lượng)
  const seen = new Map();
  const unique = [];
  
  products.forEach(p => {
    const baseName = p.name.replace(/\s+\d+(GB|TB)\s*$/i, '').trim();
    const key = `${p.brand}-${baseName}`;
    
    if (!seen.has(key)) {
      seen.set(key, true);
      unique.push(p);
    }
  });
  
  return unique;
}

// Loading Skeleton
function createProductSkeleton() {
  return `
    <div class="col-sm-6 col-md-4 col-lg-3">
      <div class="skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-button"></div>
      </div>
    </div>
  `;
}

function showLoadingSkeleton(containerSel, count = 8) {
  const container = document.querySelector(containerSel);
  if (!container) return;
  
  container.innerHTML = Array(count).fill(createProductSkeleton()).join('');
}

function createDetailSkeleton() {
  return `
    <div class="skeleton-product-detail">
      <div class="skeleton skeleton-product-image"></div>
      <div class="skeleton-product-info">
        <div class="skeleton skeleton-product-title"></div>
        <div class="skeleton skeleton-product-price"></div>
        <div class="skeleton skeleton-product-options"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text-short"></div>
      </div>
    </div>
  `;
}

function renderCard(product){
  // Lấy đường dẫn ảnh của màu đầu tiên
  let imageSrc = product.images?.[0] || 'https://via.placeholder.com/400x300';
  
  if (product.colors && product.colors.length > 0) {
    const firstColor = product.colors[0].split('(')[0].trim();
    // Loại bỏ dung lượng ROM khỏi tên sản phẩm để tạo đường dẫn ảnh đúng
    const baseProductName = product.name.replace(/\s+\d+(GB|TB)\s*$/i, '').trim();
    const productImagePath = `assets/img/${baseProductName}/${firstColor}/product.jpg`;
    imageSrc = productImagePath;
  }
  
  return `
    <div class="col-sm-6 col-md-4 col-lg-3">
      <a href="product.html?id=${product.id}" class="text-decoration-none">
        <div class="card card-product h-100" style="cursor: pointer; transition: transform 0.2s;">
          <img src="${imageSrc}" class="card-img-top" alt="${product.name}" onerror="this.src='${product.images?.[0]||'https://via.placeholder.com/400x300'}'">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-dark">${product.name}</h5>
            <p class="card-text text-primary">${product.price? currency(product.price): 'Liên hệ'}</p>
            <div class="mt-auto">
              <span class="btn btn-sm btn-outline-primary">Xem chi tiết</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  `;
}
function renderCardWithBadge(product){
  // Lấy đường dẫn ảnh của màu đầu tiên
  let imageSrc = product.images?.[0] || 'https://via.placeholder.com/400x300';
  
  if (product.colors && product.colors.length > 0) {
    const firstColor = product.colors[0].split('(')[0].trim();
    // Loại bỏ dung lượng ROM khỏi tên sản phẩm để tạo đường dẫn ảnh đúng
    const baseProductName = product.name.replace(/\s+\d+(GB|TB)\s*$/i, '').trim();
    const productImagePath = `assets/img/${baseProductName}/${firstColor}/product.jpg`;
    imageSrc = productImagePath;
  }
  
  return `
    <div class="col-sm-6 col-md-4 col-lg-3">
      <a href="product.html?id=${product.id}" class="text-decoration-none">
        <div class="card card-product h-100" style="cursor: pointer; transition: transform 0.2s;">
          <img src="${imageSrc}" class="card-img-top" alt="${product.name}" onerror="this.src='${product.images?.[0]||'https://via.placeholder.com/400x300'}'">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-dark">${product.name}</h5>
            <p class="card-text text-primary">${product.price? currency(product.price): 'Liên hệ'}</p>
            <div class="mt-auto">
              <span class="btn btn-sm btn-outline-primary">Xem chi tiết</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  `;
}
async function renderHomeFeatured(containerSel){
  const el = document.querySelector(containerSel);
  if(!el) return;
  
  // Show skeleton loading
  showLoadingSkeleton(containerSel, 4);
  
  const data = await fetchProducts();
  
  // Lấy unique models trước
  const unique = getUniqueProductModels(data);
  
  // Lấy 2 iPhone và 2 Samsung
  const iphones = unique.filter(p => p.brand === 'Apple').slice(0, 2);
  const samsungs = unique.filter(p => p.brand === 'Samsung').slice(0, 2);
  
  // Kết hợp lại
  const featured = [...iphones, ...samsungs];
  
    el.innerHTML = featured.map(renderCard).join('');
}
async function renderProductsPage(containerSel){
  const brand = qParam('brand');
  const price = qParam('price');
  const search = qParam('search');
  const data = await fetchProducts();
  let filtered = data;
  if(brand) filtered = filtered.filter(p => p.brand && p.brand.toLowerCase() === brand.toLowerCase());
  if(price) filtered = filtered.filter(p => priceFilterMatch(price, p.price || 0));
  if(search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      (p.brand && p.brand.toLowerCase().includes(searchLower))
    );
  }
  
  // Chỉ hiển thị các mẫu sản phẩm duy nhất (không tính các phiên bản dung lượng khác)
  filtered = getUniqueProductModels(filtered);
  
  // Áp dụng sắp xếp nếu có tham số sort
  const sort = qParam('sort');
  if(sort === 'asc') {
    filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if(sort === 'desc') {
    filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
  }
  
  const el = document.querySelector(containerSel);
  if(!el) return;
  
  // Hiển thị thông báo tìm kiếm nếu có
  if(search) {
    const searchInfo = document.createElement('div');
    searchInfo.className = 'alert alert-info';
    searchInfo.innerHTML = `Tìm kiếm cho: "<strong>${search}</strong>" - Có ${filtered.length} kết quả`;
    el.parentElement.insertBefore(searchInfo, el);
  }
  
  if(filtered.length===0) el.innerHTML = '<p>Không tìm thấy sản phẩm phù hợp.</p>';
  else el.innerHTML = filtered.map(renderCard).join('');
}

function applySortAndFilter(){
  const sortValue = document.getElementById('sortPrice')?.value || '';
  const url = new URL(window.location);
  if(sortValue) {
    url.searchParams.set('sort', sortValue);
  } else {
    url.searchParams.delete('sort');
  }
  window.location.href = url.toString();
}
async function renderProductDetail(containerSel){
  const el = document.querySelector(containerSel);
  if(!el) return;
  
  // Show skeleton loading
  el.innerHTML = createDetailSkeleton();
  
  const id = qParam('id');
  const data = await fetchProducts();
  const product = data.find(p => String(p.id)===String(id));
  
  if(!product){
    el.innerHTML = '<p>Sản phẩm không tồn tại.</p>';
    return;
  }
  
  // Update breadcrumb
  const breadcrumbProduct = document.getElementById('breadcrumbProduct');
  if (breadcrumbProduct) {
    breadcrumbProduct.textContent = product.name;
  }
  
  // Tìm các sản phẩm liên quan cùng tên nhưng khác dung lượng ROM
  const baseName = product.name.replace(/\s+\d+(GB|TB)\s*$/i, '').trim();
  const relatedProducts = data.filter(p => {
    const pBaseName = p.name.replace(/\s+\d+(GB|TB)\s*$/i, '').trim();
    // Phải cùng tên cơ bản và thương hiệu
    if (pBaseName !== baseName || p.brand !== product.brand) return false;
    // Phải có ROM trong tên (loại trừ sản phẩm cũ không có thông số ROM)
    if (!/\d+(GB|TB)/i.test(p.name)) return false;
    return true;
  });
  
  // Lấy màu sắc từ bất kỳ sản phẩm nào trong nhóm (ưu tiên sản phẩm hiện tại, dự phòng sản phẩm đầu tiên có màu)
  let availableColors = product.colors || [];
  if (!availableColors || availableColors.length === 0) {
    const productWithColors = relatedProducts.find(p => p.colors && p.colors.length > 0);
    if (productWithColors) {
      availableColors = productWithColors.colors;
    }
  }
  
  // Lấy tên sản phẩm cơ bản để dùng cho đường dẫn ảnh (vd: "iPhone 17" từ "iPhone 17 256GB")
  const baseProductName = baseName;
  
  // Tạo mảng ảnh đầy đủ: 5 ảnh carousel + tất cả ảnh màu sắc
  const initialImages = product.images || ['https://via.placeholder.com/600x400'];
  const allImages = [...initialImages]; // Bắt đầu với 5 ảnh carousel
  
  // Thêm tất cả ảnh màu vào mảng
  const colorImageMap = {}; // Map để lưu vị trí ảnh của mỗi màu
  if (availableColors && availableColors.length > 0) {
    availableColors.forEach((color, idx) => {
      const colorName = color.split('(')[0].trim();
      const colorImagePath = `assets/img/${baseProductName}/${colorName}/product.jpg`;
      colorImageMap[idx] = allImages.length; // Lưu vị trí ảnh màu này
      allImages.push(colorImagePath);
    });
  }
  
  // Trạng thái ban đầu
  window.currentProductState = {
    currentImageIndex: 0,
    images: allImages, // Mảng ảnh đầy đủ
    selectedColor: null,
    selectedProduct: product,
    relatedProducts: relatedProducts,
    availableColors: availableColors,
    baseProductName: baseProductName,
    defaultImages: [...initialImages], // 5 ảnh carousel gốc
    colorImageMap: colorImageMap // Map vị trí ảnh màu
  };
  
  renderProductDetailHTML(el);
}

function renderProductDetailHTML(el){
  const state = window.currentProductState;
  const product = state.selectedProduct;
  const images = state.images;
  const currentImg = images[state.currentImageIndex];
  
  el.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <div class="product-image-carousel mb-3 position-relative" onclick="openLightbox(${state.currentImageIndex})" title="Click để phóng to">
          <img id="mainProductImage" src="${currentImg}" class="img-fluid w-100" alt="${product.name}" style="max-height:500px;object-fit:contain;background:#f8f9fa;border-radius:8px;">
          ${images.length > 1 ? `
          <button class="carousel-btn carousel-btn-prev" onclick="event.stopPropagation(); changeProductImage(-1)">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
          </button>
          <button class="carousel-btn carousel-btn-next" onclick="event.stopPropagation(); changeProductImage(1)">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
          ` : ''}
          <div class="image-indicator text-center mt-2">
            <small class="text-muted">${state.currentImageIndex + 1} / ${images.length} - Click để phóng to</small>
          </div>
        </div>
        ${images.length > 1 ? `
        <div class="thumbnails-container">
          ${images.map((src, idx) => `
            <img src="${src}" 
                 class="thumbnail-img ${idx === state.currentImageIndex ? 'active' : ''}" 
                 onclick="selectProductImage(${idx})"
                 ondblclick="openLightbox(${idx})"
                 title="Click: Chọn ảnh | Double click: Phóng to"
                 style="width:80px;height:60px;object-fit:cover;cursor:pointer;border:2px solid ${idx === state.currentImageIndex ? '#0d6efd' : '#ddd'};border-radius:4px;">
          `).join('')}
        </div>
        ` : ''}
      </div>
      <div class="col-md-6">
        <h2>${product.name}</h2>
        <div class="mb-3">
          <p class="text-primary fs-4 mb-1" id="productPrice">${product.price ? currency(product.price) : 'Liên hệ để biết giá'}</p>
        </div>
        
        ${state.availableColors && state.availableColors.length > 0 ? `
        <div class="mb-3">
          <h6>Màu sắc:</h6>
          <div class="d-flex gap-2 flex-wrap">
            ${state.availableColors.map((color, idx) => {
              const colorName = color.split('(')[0].trim();
              const isSelected = state.selectedColor === idx;
              return `
                <button class="btn btn-outline-secondary btn-sm ${isSelected ? 'active' : ''}" 
                        onclick="selectColor(${idx})"
                        style="min-width:100px;">
                  ${colorName}
                </button>
              `;
            }).join('')}
          </div>
        </div>
        ` : ''}
        
        ${state.relatedProducts.length > 1 ? `
        <div class="mb-3">
          <h6>Dung lượng:</h6>
          <div class="d-flex gap-2 flex-wrap">
            ${state.relatedProducts.map(p => {
              const romMatch = p.specs?.rom || p.name.match(/\d+(GB|TB)/i)?.[0] || '';
              const isSelected = p.id === product.id;
              return `
                <button class="btn rom-option-btn ${isSelected ? 'btn-primary' : 'btn-outline-primary'} btn-sm" 
                        onclick="selectROM(${p.id})"
                        data-product-id="${p.id}"
                        style="min-width:80px;">
                  ${romMatch}
                  ${p.price ? `<br><small>${currency(p.price)}</small>` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>
        ` : ''}
        
        <p>${product.short || ''}</p>
        <a href="contact.html" class="btn btn-success mb-3">Liên hệ để mua</a>
        
        <h5>Thông số kỹ thuật</h5>
        <dl class="specs">
          <dt>Màn hình</dt><dd>${product.specs?.screen || '-'}</dd>
          <dt>RAM</dt><dd>${product.specs?.ram || '-'}</dd>
          <dt>ROM</dt><dd>${product.specs?.rom || '-'}</dd>
          <dt>Chip</dt><dd>${product.specs?.chip || '-'}</dd>
          <dt>Camera</dt><dd>${product.specs?.camera || '-'}</dd>
          <dt>Pin</dt><dd>${product.specs?.battery || '-'}</dd>
          <dt>Hệ điều hành</dt><dd>${product.specs?.os || '-'}</dd>
        </dl>
      </div>
    </div>
    <div class="mt-4">
      <h5>Mô tả</h5>
      <div class="description-content" style="text-align: justify; line-height: 1.8; white-space: pre-line;">
        ${product.description || ''}
      </div>
    </div>
  `;
}

function changeProductImage(direction){
  const state = window.currentProductState;
  state.currentImageIndex = (state.currentImageIndex + direction + state.images.length) % state.images.length;
  document.getElementById('mainProductImage').src = state.images[state.currentImageIndex];
  document.querySelector('.image-indicator small').textContent = `${state.currentImageIndex + 1} / ${state.images.length}`;
  
  // Cập nhật viền thumbnail
  document.querySelectorAll('.thumbnail-img').forEach((thumb, idx) => {
    thumb.style.border = idx === state.currentImageIndex ? '2px solid #0d6efd' : '2px solid #ddd';
    thumb.classList.toggle('active', idx === state.currentImageIndex);
  });
}

function selectProductImage(index){
  const state = window.currentProductState;
  state.currentImageIndex = index;
  document.getElementById('mainProductImage').src = state.images[index];
  document.querySelector('.image-indicator small').textContent = `${index + 1} / ${state.images.length}`;
  
  // Cập nhật viền thumbnail
  document.querySelectorAll('.thumbnail-img').forEach((thumb, idx) => {
    thumb.style.border = idx === index ? '2px solid #0d6efd' : '2px solid #ddd';
    thumb.classList.toggle('active', idx === index);
  });
}

function selectColor(colorIndex){
  const state = window.currentProductState;
  state.selectedColor = colorIndex;
  
  // Lấy vị trí ảnh màu từ colorImageMap
  const colorImageIndex = state.colorImageMap[colorIndex];
  
  // Di chuyển đến ảnh màu đó (không thay đổi mảng images)
  if (colorImageIndex !== undefined) {
    state.currentImageIndex = colorImageIndex;
  }
  
  const el = document.querySelector('#productDetail');
  if(el) renderProductDetailHTML(el);
}

async function selectROM(productId){
  const data = await fetchProducts();
  const newProduct = data.find(p => p.id === productId);
  if(!newProduct) return;
  
  const state = window.currentProductState;
  
  // Chỉ cập nhật thông tin sản phẩm, KHÔNG thay đổi ảnh
  state.selectedProduct = newProduct;
  
  // Cập nhật URL không cần reload
  const url = new URL(window.location);
  url.searchParams.set('id', productId);
  window.history.pushState({}, '', url);
  
  // Chỉ cập nhật giá và nút ROM, GIỮ NGUYÊN MÔ TẢ VÀ ẢNH
  const priceEl = document.getElementById('productPrice');
  if (priceEl) {
    priceEl.textContent = newProduct.price ? currency(newProduct.price) : 'Liên hệ để biết giá';
  }
  
  // Cập nhật trạng thái active của các nút ROM
  document.querySelectorAll('.rom-option-btn').forEach(btn => {
    const btnProductId = parseInt(btn.getAttribute('data-product-id'));
    if (btnProductId === productId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // KHÔNG cập nhật ảnh - giữ nguyên ảnh hiện tại
}

// ===== LIGHTBOX - Phóng to ảnh toàn màn hình =====
function openLightbox(imageIndex) {
  const state = window.currentProductState;
  if (!state || !state.images) return;
  
  // Tạo lightbox modal nếu chưa có
  let lightbox = document.getElementById('lightbox-modal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox-modal';
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
      <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
      <button class="lightbox-nav lightbox-nav-prev" onclick="lightboxNavigate(-1)">
        <svg fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
      </button>
      <button class="lightbox-nav lightbox-nav-next" onclick="lightboxNavigate(1)">
        <svg fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
      <div class="lightbox-content">
        <img id="lightbox-image" class="lightbox-image" src="" alt="" onclick="closeLightbox()">
      </div>
      <div class="lightbox-counter" id="lightbox-counter"></div>
    `;
    document.body.appendChild(lightbox);
    
    // Đóng lightbox khi click vào background
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Hỗ trợ phím ESC và arrow keys
    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxNavigate(-1);
      if (e.key === 'ArrowRight') lightboxNavigate(1);
    });
  }
  
  // Cập nhật ảnh và hiển thị lightbox
  state.lightboxIndex = imageIndex;
  updateLightboxImage();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Ngăn scroll trang chính
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Cho phép scroll lại
  }
}

function lightboxNavigate(direction) {
  const state = window.currentProductState;
  if (!state || !state.images) return;
  
  state.lightboxIndex = (state.lightboxIndex + direction + state.images.length) % state.images.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const state = window.currentProductState;
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCounter = document.getElementById('lightbox-counter');
  
  if (lightboxImage && state && state.images) {
    lightboxImage.src = state.images[state.lightboxIndex];
    if (lightboxCounter) {
      lightboxCounter.textContent = `${state.lightboxIndex + 1} / ${state.images.length}`;
    }
  }
}

// Expose functions to window for inline usage in pages
window.renderHomeFeatured = renderHomeFeatured;
window.renderProductsPage = renderProductsPage;
window.renderProductDetail = renderProductDetail;
window.applySortAndFilter = applySortAndFilter;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.lightboxNavigate = lightboxNavigate;

// Hàm xử lý tìm kiếm trong trang products
window.handleSearch = function(event) {
  event.preventDefault();
  const searchTerm = document.getElementById('searchInput').value.trim();
  if (searchTerm) {
    const url = new URL(window.location);
    url.searchParams.set('search', searchTerm);
    url.searchParams.delete('brand'); // Xóa filter thương hiệu khi tìm kiếm
    url.searchParams.delete('price'); // Xóa filter giá khi tìm kiếm
    window.location.href = url.toString();
  }
  return false;
};

// Hàm hiển thị gợi ý tìm kiếm
let searchTimeout;
window.showSearchSuggestions = async function(value) {
  clearTimeout(searchTimeout);
  const suggestionsDiv = document.getElementById('searchSuggestions');
  
  if (!value || value.length < 2) {
    if (suggestionsDiv) suggestionsDiv.style.display = 'none';
    return;
  }
  
  searchTimeout = setTimeout(async () => {
    const data = window.PRODUCTS_DATA || await fetch('data/products.json').then(r=>r.json()).catch(()=>[]);
    const searchLower = value.toLowerCase();
    
    // Tìm kiếm sản phẩm phù hợp
    const matches = data.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      (p.brand && p.brand.toLowerCase().includes(searchLower))
    ).slice(0, 5); // Giới hạn 5 kết quả
    
    if (matches.length > 0) {
      suggestionsDiv.innerHTML = matches.map(p => `
        <a href="product.html?id=${p.id}" class="search-suggestion-item">
          <img src="${p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/50'}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/50'">
          <div class="suggestion-info">
            <div class="suggestion-name">${p.name}</div>
            <div class="suggestion-price">${p.price ? (p.price.toLocaleString('vi-VN') + ' đ') : 'Liên hệ'}</div>
          </div>
        </a>
      `).join('');
      suggestionsDiv.style.display = 'block';
    } else {
      suggestionsDiv.innerHTML = '<div class="no-results">Không tìm thấy sản phẩm</div>';
      suggestionsDiv.style.display = 'block';
    }
  }, 300); // Debounce 300ms
};

// Đóng suggestions khi click ra ngoài
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(e) {
    const searchWrapper = document.querySelector('.search-wrapper');
    if (searchWrapper && !searchWrapper.contains(e.target)) {
      const suggestionsDiv = document.getElementById('searchSuggestions');
      if (suggestionsDiv) suggestionsDiv.style.display = 'none';
    }
  });
});