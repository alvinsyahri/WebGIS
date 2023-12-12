// include openlayer
var mapView = new ol.View ({
    center: ol.proj.fromLonLat([97.140120, 5.146124]),
    zoom: 15,
});

var map = new ol.Map ({
    target: 'map',
    view: mapView,
});

var osmFile = new ol.layer.Tile ({
    title: 'Open Street Map',
    visible: true,
    source: new ol.source.OSM(),
});

map.addLayer(osmFile);
// include openlayer

// Call API Polygon/Polyline to Web
var createLayer = function(title, layerName) {
    return new ol.layer.Tile({
        title: title,
        source: new ol.source.TileWMS({
            url: 'http://8.222.232.107:8080/geoserver/gisMnsManyang/wms',
            params: {'LAYERS': 'gisMnsManyang:' + layerName, 'TILED': true},
            serverType: 'geoserver',
            visible: true
        })
    });
};

var layers = [
    createLayer('Batas Gampong Meunasah Manyang', 'Bts_Gmpg_Mns_Manyang'),
    createLayer('Jalan', 'jalan'),
    createLayer('Balai Pengajian', 'balai_pengajian'),
    createLayer('Point Balai Pengajian', 'balaipengajianpoint'),
    createLayer('Bengkel', 'bengkel'),
    createLayer('Point Bengkel', 'bengkelpoint'),
    createLayer('Got', 'got'),
    createLayer('Gudang', 'gudang'),
    createLayer('Point Gudang', 'gudangpoint'),
    createLayer('Jurong', 'jurong'),
    createLayer('Kandang', 'kandang'),
    createLayer('Point Kandang', 'kandangpoint'),
    createLayer('Kebun', 'kebun'),
    createLayer('Point Kebun', 'kebunpoint'),
    createLayer('Kedai', 'kedai'),
    createLayer('Point Kedai', 'kedaipoint'),
    createLayer('Kesehatan', 'kesehatan'),
    createLayer('Point Kesehatan', 'kesehatanpoint'),
    createLayer('Kios', 'kios'),
    createLayer('PointKios', 'kiospoint'),
    createLayer('Lahan Kosong', 'lahan_kosong'),
    createLayer('Point Lahan Kosong', 'lahankosongpoint'),
    createLayer('Lapangan', 'lapangan'),
    createLayer('Point Lapangan', 'lapanganpoint'),
    createLayer('Lueng', 'lueng'),
    createLayer('Masjid', 'masjid'),
    createLayer('Point Masjid', 'masjidpoint'),
    createLayer('Meunasah', 'meunasah'),
    createLayer('Point Meunasah', 'meunasahpoint'),
    createLayer('Pemakaman', 'pemakaman'),
    createLayer('Point Pemakaman', 'pemakamanpoint'),
    createLayer('Pemerintahan', 'pemerintahan'),
    createLayer('Point Pemerintahan', 'pemerintahanpoint'),
    createLayer('Pendidikan', 'pendidikan'),
    createLayer('Point Pendidikan', 'pendidikanpoint'),
    createLayer('Pos Jaga', 'pos_jaga'),
    createLayer('Point Pos Jaga', 'pos_jagapoint'),
    createLayer('Rawa Rawa', 'rawa_rawa'),
    createLayer('Point Rawa Rawa', 'rawarawapoint'),
    createLayer('Rumah', 'rumah'),
    createLayer('Point Rumah', 'rumahpoint'),
    createLayer('Rumah Sendiri', 'rumah_sendiri'),
    createLayer('Point Rumah Sendiri', 'rumahsendiripoint'),
    createLayer('Sawah', 'sawah'),
    createLayer('Point Sawah', 'sawahpoint'),
    createLayer('Rangkang', 'rangkang'),
    createLayer('Point Rangkang', 'rangkangpoint'),
    createLayer('Tambak', 'tambak'),
    createLayer('Point Tambak', 'tambakpoint'),
    createLayer('Toko', 'toko'),
    createLayer('Point Toko', 'tokopoint'),
    createLayer('Usaha', 'usaha'),
    createLayer('Point Usaha', 'usahapoint')
];

layers.forEach(function(layer) {
    map.addLayer(layer);
});
// Call API Polygon/Polyline to Web

// Create popup to switch layer
var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: 'click',
    startActive: false,
    groupSelectStyle: 'children'
});

map.addControl(layerSwitcher);
// Create popup to switch layer

// Create popup Info layer
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoAnimation: {
        duration: 250
    }
});

map.addOverlay(popup);

closer.onclick = function () {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};
// Create popup Info layer

// Function to handle common logic for creating and displaying popup layers
function handlePopupLayer(layerName, featureInfoProperties, extraProperties = {}) {
    map.on('singleclick', function (evt) {
        content.innerHTML = '';
        var resolution = mapView.getResolution();
        var url = createLayer(layerName, layerName.toLowerCase()).getSource().getFeatureInfoUrl(evt.coordinate, resolution, 'EPSG:3857', {
            'INFO_FORMAT': 'application/json',
            'propertyName': featureInfoProperties
        });

        if (url) {
            console.log(url);
            $.getJSON(url, function (data) {
                var feature = data.features[0];
                var props = feature.properties;
                var popupContent = Object.entries(extraProperties).map(([key, label]) => `<h3> ${label} : </h3> <p>${props[key]}</p> <br>`).join(' ');
                content.innerHTML = popupContent;
                popup.setPosition(evt.coordinate);
            });
        } else {
            popup.setPosition(undefined);
        }
    });
}
// Function to handle common logic for creating and displaying popup layers

// Call Action popup layer Rumah Sendiri
handlePopupLayer('Rumah Sendiri', 'nama');

// Call Action popup layer Balai Pengajian
handlePopupLayer('Balai_Pengajian', 'name,teungku', { 
    'name': 'Nama Balai Pengajian', 
    'teungku': 'Nama Teungku' 
});

// Call Action popup layer Bengkel
handlePopupLayer('Bengkel', 'name', { 'name': 'Name Bengkel' });

// Call Action popup layer Rumah
handlePopupLayer('Rumah', 'no_rumah,pemilik,no_ktp,telepon,penghuni,ktp,laki_laki,perempuan,total', {
    'pemilik': 'Nama Pemilik',
    'no_ktp': 'Ktp Pemilik',
    'telepon': 'No Telepon',
    'penghuni': 'Nama Penghuni',
    'ktp': 'Ktp Penghuni',
    'laki_laki': 'Jumlah Penghuni Laki-Laki',
    'perempuan': 'Jumlah Penghuni Perempuan',
    'total': 'Total Penghuni'
});

// Call Action popup layer Gudang
handlePopupLayer('Gudang', 'pemilik,name,simpan', { 
    'pemilik': 'Nama Pemilik', 
    'name': 'Nama Gudang', 
    'simpan': 'Isi' });

// Call Action popup layer Kandang
handlePopupLayer('Kandang', 'name', { 'name': 'Nama kandang' });

// Call Action popup layer Kebun
handlePopupLayer('Kebun', 'name', { 'name': 'Nama Kebun' });

// Call Action popup layer Kedai
handlePopupLayer('Kedai', 'name', { 'name': 'Nama Kedai' });

// Call Action popup layer Kesehatan
handlePopupLayer('Kesehatan', 'nama', { 'nama': 'Nama Kesehatan' });

// Call Action popup layer Kios
handlePopupLayer('Kios', 'pemilik,jenis,name', { 
    'pemilik': 'Nama Pemilik', 
    'name': 'Nama Kedai', 
    'jenis': 'Jenis Kedai' 
});

// Call Action popup layer Lahan Kosong
handlePopupLayer('Lahan_kosong', 'name', { 'name': 'Nama Pemilik' });

// Call Action popup layer Lapangan
handlePopupLayer('Lapangan', 'nama,pemilik', { 
    'nama': 'Nama Lapangan', 
    'pemilik': 'Hak Milik' 
});

// Call Action popup layer Masjid
handlePopupLayer('Masjid', 'nama', { 'nama': 'Nama Mesjid' });

// Call Action popup layer Pemerintahan
handlePopupLayer('Pemerintahan', 'geuchik,nama', { 
    'geuchik': 'Nama Geuchik', 
    'nama': 'Nama Kantor' 
});

// Call Action popup layer Meunasah
handlePopupLayer('Meunasah', 'nama,pemilik', { 
    'nama': 'Nama Meunasah', 
    'pemilik': 'Hak Milik' 
});

// Call Action popup layer Pendidikan
handlePopupLayer('Pendidikan', 'name', { 'name': 'Nama Pendidikan' });

// Call Action popup layer Pos Jaga
handlePopupLayer('Pos_Jaga', 'name', { 'name': 'Nama Post Jaga' });

// Call Action popup layer Rangkang
handlePopupLayer('Rangkang', 'name', { 'name': 'Nama Rangkang' });

// Call Action popup layer Rawa Rawa
handlePopupLayer('Rawa_Rawa', 'name', { 'name': 'Nama Rawa Rawa' });

// Call Action popup layer Sawah
handlePopupLayer('Sawah', 'pemilik,luas', { 
    'pemilik': 'Pemilik', 
    'luas': 'Luas Sawah' 
});

// Call Action popup layer Tambak
handlePopupLayer('Tambak', 'pemilik,jenis', { 
    'pemilik': 'Nama Pemilik', 
    'jenis': 'Jenis Budidaya' 
});

// Call Action popup layer Toko
handlePopupLayer('Toko', 'nama,pemilik,jenis', { 
    'nama': 'Nama Toko', 
    'jenis': 'Jenis Toko', 
    'pemilik': 'Nama Pemilik' 
});

// Call Action popup layer Usaha
handlePopupLayer('Usaha', 'name', { 'name': 'Nama Usaha' });