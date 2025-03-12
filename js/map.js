// 地图实例
let map = null;
let markers = [];

// 初始化地图
async function initMap(container) {
    try {
        console.log('开始初始化地图...');
        if (typeof AMap === 'undefined') {
            throw new Error('高德地图API未加载');
        }
        
        // 创建地图实例
        map = new AMap.Map(container, {
            zoom: 11,
            center: [120.153576, 30.287459], // 杭州市中心
            viewMode: '2D',
            resizeEnable: true
        });

        // 等待地图加载完成
        await new Promise((resolve) => {
            map.on('complete', () => {
                console.log('地图加载完成');
                resolve();
            });
        });

        console.log('地图实例创建成功');

        // 添加地图控件
        map.addControl(new AMap.Scale());
        map.addControl(new AMap.ToolBar({
            position: 'RB'
        }));

        return true;
    } catch (error) {
        console.error('地图初始化失败:', error);
        document.getElementById(container).innerHTML = 
            '<div class="error-message">地图初始化失败，请刷新页面重试</div>';
        return false;
    }
}

// 显示选定城市的门店
async function showCityStores(city) {
    if (!window.storeData || !window.storeData.stores) {
        console.error('门店数据未加载');
        return;
    }

    // 筛选选定城市的门店
    const cityStores = window.storeData.stores.filter(store => store.city === city);
    console.log(`${city}共有${cityStores.length}家门店`);

    // 清除现有标记
    clearMarkers();

    // 更新左侧门店列表
    updateStoreList(cityStores);

    // 添加门店标记到地图
    await addStoreMarkers(cityStores);
}

// 更新左侧门店列表
function updateStoreList(stores) {
    const listContainer = document.getElementById('store-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    
    stores.forEach(store => {
        const div = document.createElement('div');
        div.className = 'store-item';
        
        // 提取品牌名称（去掉"界环眼镜-"前缀）
        const brandName = store.name.replace('界环眼镜-', '');
        
        div.innerHTML = `
            <div class="store-name">${brandName}</div>
            <div class="store-address">${store.address}</div>
            <div class="store-actions">
                <button class="nav-button" onclick="event.stopPropagation(); window.open('https://uri.amap.com/navigation?to=${store.longitude},${store.latitude},${store.name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 12h4v8h4v-6h4v6h4v-8h4L12 2z"/>
                    </svg>
                    导航
                </button>
            </div>
        `;
        
        div.onclick = () => {
            if (store.latitude && store.longitude) {
                // 确保获取到地图实例
                const currentMap = window.mapUtils.map();
                if (!currentMap) {
                    console.error('地图实例未找到');
                    return;
                }

                // 关闭之前的信息窗口
                if (window.mapUtils.currentInfoWindow) {
                    window.mapUtils.currentInfoWindow.close();
                }
                
                // 设置地图中心和缩放级别，添加动画效果
                const position = [store.longitude, store.latitude];
                currentMap.setStatus({animateEnable: true});  // 启用动画
                
                // 先设置中心点，再设置缩放级别
                currentMap.setCenter(position);
                currentMap.setZoom(15);
                
                // 找到对应的标记并触发动画
                const marker = markers.find(m => {
                    const mPosition = m.getPosition();
                    return mPosition.lng === store.longitude && mPosition.lat === store.latitude;
                });
                
                if (marker) {
                    marker.setAnimation('AMAP_ANIMATION_BOUNCE');
                    setTimeout(() => {
                        marker.setAnimation(null);
                    }, 1000);
                }

                // 显示信息窗口
                setTimeout(() => {
                    showStoreInfo(store);
                }, 300);
                
                // 高亮选中的门店
                div.classList.add('store-item-active');
                
                // 移除其他门店的高亮
                document.querySelectorAll('.store-item').forEach(item => {
                    if (item !== div) {
                        item.classList.remove('store-item-active');
                    }
                });
            }
        };
        
        listContainer.appendChild(div);
    });
}

// 聚焦到特定门店
function focusStore(lng, lat, name) {
    if (!map) return;
    
    map.setZoomAndCenter(15, [lng, lat]);
    
    // 找到对应的marker并显示信息窗口
    const marker = markers.find(m => {
        const position = m.getPosition();
        return position.lng === lng && position.lat === lat;
    });
    
    if (marker) {
        const store = window.storeData.stores.find(s => 
            s.longitude === lng && s.latitude === lat
        );
        if (store) {
            showStoreInfo(store);
        }
    }
}

// 分批处理数组
function batchProcess(array, batchSize) {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
        batches.push(array.slice(i, i + batchSize));
    }
    return batches;
}

// 添加门店标记
async function addStoreMarkers(stores) {
    if (!map) {
        console.error('地图实例未初始化');
        return;
    }

    console.log(`开始添加 ${stores.length} 个门店标记...`);

    // 清除现有标记
    clearMarkers();

    // 定义品牌颜色
    const brandColors = {
        '宝丽': '#FF6B6B',
        '总统': '#4ECDC4',
        '星创': '#45B7D1',
        '宝岛': '#96CEB4',
        '精功': '#FFEEAD',
        '翼蓝': '#D4A5A5',
        '山姆': '#9B59B6'
    };

    // 获取品牌颜色
    function getBrandColor(name) {
        for (const [brand, color] of Object.entries(brandColors)) {
            if (name.includes(brand)) return color;
        }
        return '#000000'; // 默认颜色
    }

    try {
        // 直接使用已有的经纬度数据
        stores.forEach(store => {
            if (store.latitude && store.longitude) {
                const markerColor = getBrandColor(store.name);
                
                // 创建标记
                const marker = new AMap.Marker({
                    position: [store.longitude, store.latitude],
                    title: store.name,
                    map: map,
                    anchor: 'bottom-center',
                    offset: new AMap.Pixel(0, 0),
                    icon: new AMap.Icon({
                        size: new AMap.Size(32, 40),
                        image: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40">
                                <path fill="${markerColor}" d="M16 0C7.2 0 0 7.2 0 16c0 11.2 16 24 16 24s16-12.8 16-24c0-8.8-7.2-16-16-16zm0 24c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
                            </svg>
                        `),
                        imageSize: new AMap.Size(32, 40)
                    }),
                    animation: 'AMAP_ANIMATION_DROP'
                });

                // 添加点击事件
                marker.on('click', () => {
                    // 设置地图中心和缩放级别
                    map.setZoomAndCenter(15, [store.longitude, store.latitude], true);
                    // 显示信息窗口
                    showStoreInfo(store);
                });

                // 添加鼠标移入事件
                marker.on('mouseover', () => {
                    marker.setAnimation('AMAP_ANIMATION_BOUNCE');
                });

                // 添加鼠标移出事件
                marker.on('mouseout', () => {
                    marker.setAnimation(null);
                });

                markers.push(marker);
            }
        });

        // 创建标记聚合
        if (markers.length > 0) {
            console.log(`创建标记聚合，共 ${markers.length} 个标记`);
            new AMap.MarkerClusterer(map, markers, {
                gridSize: 60,
                maxZoom: 16,
                minClusterSize: 2,
                renderClusterMarker: function(context) {
                    const count = context.count;
                    const size = Math.min(count, 100);
                    context.marker.setContent(`
                        <div style="
                            background-color: rgba(0, 0, 0, 0.8);
                            width: ${40 + size/3}px;
                            height: ${40 + size/3}px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: ${14 + size/10}px;
                            font-weight: bold;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                            border: 2px solid white;
                        ">
                            ${count}
                        </div>
                    `);
                }
            });

            // 调整地图视野以包含所有标记
            map.setFitView(markers, {
                padding: [50, 50, 50, 50] // 设置视野调整的边距
            });
        }
    } catch (error) {
        console.error('添加门店标记失败:', error);
    }
}

// 清除所有标记
function clearMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);
    });
    markers = [];
}

// 处理定位按钮点击
async function handleLocationClick(address) {
    try {
        // 创建一个临时输入框
        const tempInput = document.createElement('textarea');
        tempInput.value = address;
        document.body.appendChild(tempInput);

        // 在移动端，使用 execCommand 可能不被支持，所以我们使用新的 API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(address);
            showToast('地址已复制到剪贴板');
        } else {
            // 回退方案
            tempInput.select();
            document.execCommand('copy');
            showToast('地址已复制到剪贴板');
        }

        document.body.removeChild(tempInput);

        // 尝试打开高德地图
        const mapUrl = `https://uri.amap.com/marker?position=${store.lng},${store.lat}&name=${encodeURIComponent(store.name)}&src=myapp&coordinate=gaode&callnative=1`;
        window.location.href = mapUrl;
    } catch (err) {
        console.error('复制地址失败:', err);
        showToast('复制地址失败，请手动复制');
    }
}

// 显示提示信息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);

    // 2秒后移除提示
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 2000);
}

// 修改 showStoreInfo 函数
function showStoreInfo(store) {
    const storeList = document.getElementById('store-list');
    const storeElement = document.createElement('div');
    storeElement.className = 'store-item';
    storeElement.innerHTML = `
        <h3>${store.name}</h3>
        <p>${store.address}</p>
        <div class="store-actions">
            <button class="location-btn" onclick="handleLocationClick('${store.address}')">
                <span class="icon">📍</span> 定位
            </button>
            <button class="navigation-btn" onclick="window.location.href='https://uri.amap.com/marker?position=${store.lng},${store.lat}&name=${encodeURIComponent(store.name)}&src=myapp&coordinate=gaode&callnative=1'">
                <span class="icon">🗺️</span> 导航
            </button>
        </div>
    `;
    storeList.appendChild(storeElement);
}

// 导出函数
window.mapUtils = {
    initMap,
    showCityStores,
    clearMarkers,
    focusStore,
    showStoreInfo,
    addStoreMarkers,
    map: () => map,
    currentInfoWindow: null
}; 