// Inisialisasi OpenLayer
var mapView = new ol.View ({
    center: ol.proj.fromLonLat([97.140120, 5.146124]),
    zoom: 15,
});

var map = new ol.Map ({
    target: 'map',
    view: mapView,
});
// Inisialisasi OpenLayer

//Inisialisasi Layer Maps
var nonTile = new ol.layer.Tile ({
    title: 'None',
    type: 'base',
    visible: false
});

var osmFile = new ol.layer.Tile ({
    title: 'Open Street Map',
    type: 'base',
    visible: false,
    source: new ol.source.OSM(),
});

var googleSatLayer = new ol.layer.Tile({
    title: 'Google Satellite',
    type: 'base',
    visible: true,
    source: new ol.source.XYZ({
        url: 'https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        maxZoom: 20,
        tilePixelRatio: 1,
        tileSize: 256,
        projection: 'EPSG:3857',
    }),
});

var baseGroup = new ol.layer.Group ({
    title: 'Base Maps',
    layers: [nonTile, osmFile, googleSatLayer]
});

map.addLayer(baseGroup);
//Inisialisasi Layer Maps

// create function addLayer
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
// create function addLayer

// Inisialisasi Layer Polygon
var polygonGroup = new ol.layer.Group({
    title: 'Polygon',
    layers: [
        createLayer('Batas Gampong Meunasah Manyang', 'bts_gmpg_mns_manyang'),
        createLayer('Balai Pengajian', 'balai_pengajian'),
        createLayer('Bengkel', 'bengkel'),
        createLayer('Gudang', 'gudang'),
        createLayer('Kandang', 'kandang'),
        createLayer('Kebun', 'kebun'),
        createLayer('Kedai', 'kedai'),
        createLayer('Point Kedai', 'kedaipoint'),
        createLayer('Kesehatan', 'kesehatan'),
        createLayer('Kios', 'kios'),
        createLayer('Lahan Kosong', 'lahan_kosong'),
        createLayer('Lapangan', 'lapangan'),
        createLayer('Masjid', 'masjid'),
        createLayer('Meunasah', 'meunasah'),
        createLayer('Pemakaman', 'pemakaman'),
        createLayer('Pemerintahan', 'pemerintahan'),
        createLayer('Pendidikan', 'pendidikan'),
        createLayer('Pos Jaga', 'pos_jaga'),
        createLayer('Rawa Rawa', 'rawa_rawa'),
        createLayer('Rumah', 'rumah'),
        createLayer('Rumah Sendiri', 'rumah_sendiri'),
        createLayer('Sawah', 'sawah'),
        createLayer('Rangkang', 'rangkang'),
        createLayer('Tambak', 'tambak'),
        createLayer('Toko', 'toko'),
        createLayer('Usaha', 'usaha'),
    ],
});

map.addLayer(polygonGroup);
// Inisialisasi Layer Polygon

// Inisialisasi Layer Polyline
var polylineGroup = new ol.layer.Group({
    title: 'Polyline',
    layers: [
        createLayer('Jalan', 'jalan'),
        createLayer('Got', 'got'),
        createLayer('Jurong', 'jurong'),
        createLayer('Lueng', 'lueng'),
    ],
});

map.addLayer(polylineGroup);
// Inisialisasi Layer Polyline

// Inisialisasi Layer Point
var pointGroup = new ol.layer.Group({
    title: 'Point',
    layers: [
        createLayer('Point Balai Pengajian', 'balaipengajianpoint'),
        createLayer('Point Bengkel', 'bengkelpoint'),
        createLayer('Point Gudang', 'gudangpoint'),
        createLayer('Point Kandang', 'kandangpoint'),
        createLayer('Point Kebun', 'kebunpoint'),
        createLayer('Point Kedai', 'kedaipoint'),
        createLayer('Point Kesehatan', 'kesehatanpoint'),
        createLayer('PointKios', 'kiospoint'),
        createLayer('Point Lahan Kosong', 'lahankosongpoint'),
        createLayer('Point Lapangan', 'lapanganpoint'),
        createLayer('Point Masjid', 'masjidpoint'),
        createLayer('Point Meunasah', 'meunasahpoint'),
        createLayer('Point Pemakaman', 'pemakamanpoint'),
        createLayer('Point Pemerintahan', 'pemerintahanpoint'),
        createLayer('Point Pendidikan', 'pendidikanpoint'),
        createLayer('Point Pos Jaga', 'pos_jagapoint'),
        createLayer('Point Rawa Rawa', 'rawarawapoint'),
        createLayer('Point Rumah', 'rumahpoint'),
        createLayer('Point Rumah Sendiri', 'rumahsendiripoint'),
        createLayer('Point Sawah', 'sawahpoint'),
        createLayer('Point Rangkang', 'rangkangpoint'),
        createLayer('Point Tambak', 'tambakpoint'),
        createLayer('Point Toko', 'tokopoint'),
        createLayer('Point Usaha', 'usahapoint')
    ],
});

map.addLayer(pointGroup);
// Inisialisasi Layer Point

// Button Switcher Layer
var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: 'click',
    startActive: false,
    groupSelectStyle: 'children'
});

map.addControl(layerSwitcher);
// Button Switcher Layer

// Button Popup
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
// Button Popup

// Button Closer Popup
closer.onclick = function () {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};
// Button Closer Popup

// Function Show Popup
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
                var nilaiDenganSpasi = layerName.replace(/_/g, ' ');

                // Memulai popup dengan tag dan struktur awal
                var popupContent = `<h4 class="text-primary mb-3">${nilaiDenganSpasi}</h4>` +
                                   '<div class="container"><table class="table table-striped ol-popup-table"' +
                                   '<thead><tr><th>Properties</th><th>Value</th></tr></thead>';

                // Menambahkan data dari extraProperties ke dalam popupContent
                popupContent += Object.entries(extraProperties).map(([key, label]) => `<tr><td style="white-space: nowrap;">${label}</td><td style="white-space: nowrap;">${props[key]}</td></tr>`).join(' ');

                // Menutup struktur popup
                popupContent += '</table></div>';

                // Menetapkan konten popup dan menampilkan posisi popup
                content.innerHTML = popupContent;
                popup.setPosition(evt.coordinate);
            });
        } else {
            popup.setPosition(undefined);
        }
    });
}
// Function Show Popup

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

// Call Action popup layer Rumah Sendiri
handlePopupLayer('Rumah Sendiri', 'nama', { 'nama': 'Nama Bapak'});