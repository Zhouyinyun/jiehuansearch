// DOM 元素
const currentLocationEl = document.getElementById('current-location');
const refreshLocationBtn = document.getElementById('refresh-location');
const searchInput = document.getElementById('search-input');
const citySelect = document.getElementById('city-select');
const storeListEl = document.getElementById('store-list');

// 存储状态
let currentLocationMarker = null;
let filteredStores = [];

// 初始化应用
async function initApp() {
    try {
        // 初始化地图
        mapUtils.initMap('map-container');
        
        console.log('开始获取位置...');
        // 获取当前位置
        const position = await storeUtils.getCurrentLocation();
        console.log('获取位置成功:', position);
        handleLocationSuccess(position);
    } catch (error) {
        console.error('初始化失败:', error);
        handleLocationError(error);
    }

    // 添加事件监听
    setupEventListeners();
}

// 处理位置获取成功
function handleLocationSuccess(position) {
    currentLocationEl.textContent = '已获取到您的位置';
    
    // 添加当前位置标记
    if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
    }
    currentLocationMarker = mapUtils.addCurrentLocationMarker(position);
    
    // 更新门店列表
    updateStoresList();
}

// 处理位置获取失败
function handleLocationError(error) {
    console.error('获取位置失败:', error);
    currentLocationEl.textContent = '无法获取您的位置，请手动选择城市';
    updateStoresList();
}

// 设置事件监听器
function setupEventListeners() {
    // 刷新位置按钮
    refreshLocationBtn.addEventListener('click', async () => {
        try {
            const position = await storeUtils.getCurrentLocation();
            handleLocationSuccess(position);
        } catch (error) {
            handleLocationError(error);
        }
    });

    // 搜索输入
    searchInput.addEventListener('input', updateStoresList);

    // 城市选择
    citySelect.addEventListener('change', updateStoresList);
}

// 更新门店列表
async function updateStoresList() {
    const searchText = searchInput.value.trim();
    const selectedCity = citySelect.value;

    // 获取最新的门店数据
    const stores = await storeUtils.loadStores();

    // 过滤门店
    filteredStores = storeUtils.filterStores(stores, searchText, selectedCity);

    // 如果有当前位置，按距离排序
    if (currentLocationMarker) {
        filteredStores = storeUtils.sortStoresByDistance(filteredStores, {
            latitude: currentLocationMarker.getPosition().lat,
            longitude: currentLocationMarker.getPosition().lng
        });
    }

    // 更新地图标记
    mapUtils.addStoreMarkers(filteredStores);

    // 更新列表显示
    renderStoresList(filteredStores);
}

// 渲染门店列表
function renderStoresList(stores) {
    storeListEl.innerHTML = stores.map(store => `
        <div class="store-card" onclick="showStoreDetail('${store.name}')">
            <div class="store-name">${store.name}</div>
            <div class="store-address">${store.address}</div>
            ${store.distance ? `
                <div class="store-distance">距离：${store.distance.toFixed(1)}km</div>
            ` : ''}
        </div>
    `).join('');
}

// 显示门店详情
function showStoreDetail(storeName) {
    const store = filteredStores.find(s => s.name === storeName);
    if (store && store.latitude && store.longitude) {
        mapUtils.map.setCenter([store.longitude, store.latitude]);
        mapUtils.showStoreInfo(store);
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', initApp);

// 暴露给全局作用域
window.showStoreDetail = showStoreDetail; 