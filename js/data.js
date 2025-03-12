// 门店数据
window.storeData = {
    stores: [
        { id: 1, name: "宝丽西溪印象城", address: "浙江省杭州市余杭区五常街道五常大道1号P1-B1M-07b", city: "杭州" },
        { id: 2, name: "宝丽乐堤港", address: "浙江省杭州市拱墅区乐堤港商业中心005室", city: "杭州" },
        { id: 3, name: "宝丽城西银泰", address: "浙江省杭州市拱墅区丰潭路380号B1038室（铺位号：B1018）", city: "杭州" },
        { id: 4, name: "宝丽文二店", address: "浙江省杭州市西湖区文二路192号", city: "杭州" },
        { id: 5, name: "宝丽奥体印象城", address: "浙江省杭州市萧山区盈丰街道飞虹路1408号汇德隆印象城B1层48号", city: "杭州" },
        { id: 6, name: "杭州万象城总统眼镜", address: "杭州富春路701号杭州万象城第B1层第B145号商铺", city: "杭州" },
        { id: 7, name: "杭州滨江银泰总统眼镜", address: "浙江省杭州市滨江区滨和路与阡陌路交叉口银泰百货B馆1楼143号商铺", city: "杭州" },
        { id: 8, name: "星创视光中心杭州萍水街店", address: "浙江省杭州市拱墅区新武林中心1118-1121室一层（寳島眼镜）", city: "杭州" },
        { id: 9, name: "宝岛眼镜杭州滨江星光大道店", address: "浙江省杭州市滨江区江南大道288号1幢101-C室", city: "杭州" },
        { id: 10, name: "星创视光中心杭州中北店", address: "浙江省杭州市拱墅区凤起路320号", city: "杭州" },
        { id: 11, name: "宝岛眼镜杭州金沙印象城店", address: "浙江省杭州市钱塘区下沙街道金沙大道97号金沙印象城五层512室（L508）", city: "杭州" },
        { id: 12, name: "宝岛眼镜杭州文二路店", address: "浙江省杭州市西湖区文二路268号1-8层（杭州锦辰酒店管理有限公司103室、105室）", city: "杭州" },
        { id: 13, name: "宝岛眼镜杭州西湖银泰城店", address: "浙江省杭州市上城区延安路98号", city: "杭州" },
        { id: 14, name: "星创视光中心杭州富阳苋浦店", address: "浙江省杭州市富阳区富春街道苋浦西路139号一层", city: "杭州" },
        { id: 15, name: "滨盛店", address: "浙江省杭州市滨江区滨盛路3867号宝龙城2幢101室", city: "杭州" },
        { id: 16, name: "滨江天街店", address: "浙江省杭州市滨江区江汉路1515号江南天街商业中心1幢201-5室", city: "杭州" },
        { id: 17, name: "西溪天街店", address: "浙江省杭州市西湖区蒋村街道余杭塘路1001号西溪天街2号楼二层5号", city: "杭州" },
        { id: 18, name: "文新店", address: "浙江省杭州市西湖区文二西路338号", city: "杭州" },
        { id: 19, name: "城北万象城店", address: "浙江省杭州市余杭区良渚街道杭行路1499号L226号", city: "杭州" },
        { id: 20, name: "中山北路店", address: "浙江省杭州市拱墅区中山北路313号", city: "杭州" },
        { id: 21, name: "文二店", address: "浙江省杭州市西湖区翠苑街道文二路202号1楼101、102、103室", city: "杭州" },
        { id: 22, name: "翼蓝杭州萧山机场3店-T3", address: "杭州萧山国际机场T3航站楼B23登机口旁", city: "杭州" },
        { id: 23, name: "翼蓝杭州萧山机场5店-T3", address: "杭州萧山国际机场T3航站楼B42登机口对面", city: "杭州" },
        { id: 24, name: "翼蓝杭州萧山机场2店-T4", address: "杭州萧山国际机场T4航站楼", city: "杭州" },
        { id: 25, name: "杭州西溪山姆会员商店", address: "浙江省杭州市余杭区五常大道1号P1-A001山姆会员商店", city: "杭州" },
        { id: 26, name: "杭州北山姆会员店", address: "浙江省杭州市江干区大农港路1216号山姆会员店眼镜中心", city: "杭州" },
        { id: 27, name: "杭州萧山山姆会员店", address: "浙江省杭州市印力汇德隆奥体印象城萧山山姆会员店眼镜中心", city: "杭州" },
        { id: 28, name: "宝岛眼镜嘉兴禾兴南路店", address: "浙江省嘉兴市南湖区禾兴南路384号、386号", city: "嘉兴" },
        { id: 29, name: "精功眼镜", address: "浙江省嘉兴市桐乡市濮院镇凯旋路1698号", city: "嘉兴" },
        { id: 30, name: "宁波万象城总统眼镜", address: "浙江省宁波市江北区甬江街道华润万象城L1层L184号商铺", city: "宁波" },
        { id: 31, name: "宁波鄞州区鄞县大道山姆会员商店", address: "浙江省宁波市鄞州区钟公庙街道欢乐海岸17号山姆会员店眼镜中心", city: "宁波" },
        { id: 32, name: "宁波清河路山姆会员商店", address: "浙江省宁波市江北区清河路269号", city: "宁波" },
        { id: 33, name: "宝岛眼镜衢州吾悦购物中心店", address: "浙江省衢州市柯城区白云街道白云中大道99号新城吾悦广场1幢253-34号（二楼2040商铺）", city: "衢州" },
        { id: 34, name: "精功眼镜", address: "浙江省绍兴市柯桥区杨汛桥镇江桥路", city: "绍兴" },
        { id: 35, name: "精功眼镜", address: "浙江省绍兴市越城区越安北路与群贤路交叉口宝龙广场一楼", city: "绍兴" }
    ]
};

// 从门店数据中提取城市列表
window.storeData.cities = [...new Set(window.storeData.stores.map(store => store.city))].sort();

// 计算两点之间的距离（单位：公里）
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// 获取最近的门店
function getNearestStores(latitude, longitude, limit = 5) {
    return window.storeData.stores.map(store => {
        if (store.latitude && store.longitude) {
            store.distance = calculateDistance(latitude, longitude, store.latitude, store.longitude);
        }
        return store;
    })
    .filter(store => typeof store.distance === 'number')
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

// 扩展现有的 storeData 对象，而不是重新赋值
Object.assign(window.storeData, {
    calculateDistance,
    getNearestStores
}); 