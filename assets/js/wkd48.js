var detail = ''
// ===============================================================================
let apiKey = 'AIzaSyA6tE5WtKuHfH1N7HT9r4_qBd8Zcx23fGg'
let spreadsheetId = '1HRjXiyVwZcMbWFRUv7PRz6hgS6lfhChHSnLfwaSbzdI'
let urlBase = 'https://sheets.googleapis.com/v4/spreadsheets/'
// ===============================================================================
function generateURL(urlBase,spreadsheetId,apiKey,seasonName,columnRange){
  return urlBase + spreadsheetId + '/values/' + encodeURIComponent(seasonName) + '!' + columnRange + '?key=' + apiKey;
}
function convertCurrencyToInt(currencyString) {
    return parseInt(currencyString.replace(/[^\d]/g, ''));
}
function formatRupiah(amount) {
    var formattedValue = amount.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });
    formattedValue = formattedValue.replace(',00', '');
    return formattedValue;
}
function loadContent(mod,det='') {
  detail = det
  $('.nav-link').removeClass('active');
  $('.nav-link[data-page="' + mod + '"]').addClass('active');
  $.get('modul/page-'+mod+'.html', function(data) {
      $('#wkd48-content').html(data);
  });
}
function generateSeasonMenu(urlBase,spreadsheetId,apiKey){
  $.ajax({
      url: urlBase + spreadsheetId + '?fields=sheets.properties.title&key=' + apiKey,
      dataType: 'json',
      success: function(data) {
          var sheets = data.sheets;
          var sheetNames = [];
          for (var i = 0; i < sheets.length; i++) {
            var sheetName = sheets[i].properties.title
            sheetNames.push(sheetName);
            $('#submenu-rekap').append('<li><a href="javascript:" onclick="loadContent(\'rekap\',\''+sheetName+'\')">'+sheetName+'</a></li>')
            $('#submenu-galeri').append('<li><a href="javascript:" onclick="loadContent(\'galeri\',\''+sheetName+'\')">'+sheetName+'</a></li>')
          }
      },
      error: function(xhr, status, error) {
          console.error('Error:', error);
      }
  });

}
function generateImageHome(){
  for (var i = 1; i <=8; i++) {
    var images = '<div class="col-xl-3 col-lg-4 col-md-6">'+
                    '<div class="gallery-item h-100">'+
                      '<img src="assets/lagaleria/GALERIA-' + i + '.jpg" class="img-fluid" alt="">'+
                      '<div class="gallery-links d-flex align-items-center justify-content-center">'+
                        '<a href="assets/lagaleria/GALERIA-' + i + '.jpg" title="Dokumentasi Kegiatan" class="glightbox preview-link"><i class="bi bi-arrows-fullscreen"></i></a>'+
                      '</div>'+
                    '</div>'+
                  '</div>'
    $('#image-container').append(images);
  }
  var lightbox = GLightbox({
      selector: '.glightbox'
  });
}
function generateImageGaleria(urlBase,spreadsheetId,apiKey,seasonName){
  let columnRange = 'R3:R42'
  let url = generateURL(urlBase,spreadsheetId,apiKey,seasonName,columnRange)
  let bucket = 'https://firebasestorage.googleapis.com/v0/b/wkd48-af4e6.appspot.com/o/'
  $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
          var target = $('#image-container');
          target.empty()
          $.each(data.values, function(index, row) {
              if(row[0]!=''){
                  var images = '<div class="col-xl-3 col-lg-4 col-md-6">'+
                                '<div class="gallery-item h-100">'+
                                  '<img src="'+bucket + row[0] + '" class="img-fluid" alt="">'+
                                  '<div class="gallery-links d-flex align-items-center justify-content-center">'+
                                    '<a href="'+bucket + row[0] + '" title="Dokumentasi Kegiatan" class="glightbox preview-link"><i class="bi bi-arrows-fullscreen"></i></a>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'
                  target.append(images);
              }
          });
          var lightbox = GLightbox({
              selector: '.glightbox'
          });
      },
      error: function(xhr, status, error) {
          console.error('Error:', error);
      }
  });
}
function getSeasonInformasi(urlBase,spreadsheetId,apiKey,seasonName){
  let columnRange = 'B3:B11'
  let url = generateURL(urlBase,spreadsheetId,apiKey,seasonName,columnRange)
  $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        var dataset = [];
        $.each(data.values, function(index, row) {
            if(row[0]!=''){
              dataset.push(row[0])
            }
        });

        if(dataset[8]=='Active'){
          $('.season_description').html('Saat ini <b> Program Rp. 10.000 Menguasai Dunia Bersama WKD48 - <span class="text-warning">'+detail+'</span></b> sedang berlangsung. Untuk melihat detail Rekapannya dapat dilihat di <a href="https://pongimaji.github.io/WKD48-RAWR" target="_BLANK"><b>WKD48 ACTIVE REKAP</b></a>')
          $('#data-detail').attr('hidden',true)
        }else{
          $('.season_description').html('Pada halaman ini anda dapat melihat rekap terkait pelaksanaan <b> Program Rp. 10.000 Menguasai Dunia Bersama WKD48 - <span class="text-warning">'+detail+'</span></b>')
          $('#data-detail').attr('hidden',false)

          $('.str_peserta').html(dataset[7]+' Peserta')  
          $('.str_donasipeserta').html(dataset[3])  
          $('.str_donasinonpeserta').html(dataset[4])  
          $('.str_terkumpul').html(dataset[5])  
          $('.str_durasi').html(dataset[2])  
          $('.str_periode').html(dataset[1])  

          getSeasonPemasukan(urlBase,spreadsheetId,apiKey,detail)
          getSeasonPemakaianDana(urlBase,spreadsheetId,apiKey,detail)
          getOrangBaik(urlBase,spreadsheetId,apiKey,detail)
        }

      },
      error: function(xhr, status, error) {
          console.error('Error:', error);
      }
  });
}
function getSeasonPemasukan(urlBase,spreadsheetId,apiKey,seasonName){
  let columnRange = 'H3:J52'
  let url = generateURL(urlBase,spreadsheetId,apiKey,seasonName,columnRange)
  $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        var target = $('#data-pemasukan');
        target.empty()
        $.each(data.values, function(index, row) {
            if(row[0]!=''){
              var html = '<li>'+
                            '<i class="bi bi-chevron-right"></i> '+
                            '<strong><span class="text-success">'+row[0]+'</span></strong> -'+
                            '<span>'+row[1]+'</span> : <strong><span class="text-warning">'+row[2]+'</span></strong>'+
                          '</li>'
              target.append(html)
            }
        });

      },
      error: function(xhr, status, error) {
          console.error('Error:', error);
      }
  });
}
function getSeasonPemakaianDana(urlBase,spreadsheetId,apiKey,seasonName){
  let columnRange = 'M3:O52'
  let url = generateURL(urlBase,spreadsheetId,apiKey,seasonName,columnRange)
  $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        var total = 0
        var target = $('#data-pemanfaatandana');
        target.empty()
        $.each(data.values, function(index, row) {
            if(row[0]!=''){
              total+= convertCurrencyToInt(row[2])
              target.append(target.append('<li><strong>'+row[0]+'</strong> <span>'+row[1]+'</span><span class="text-warning">'+row[2]+'</span></li>'))
            }
        });
        target.append('<li><b>Total Pemanfaatan dana:</b> <b class="text-warning" style="font-size:24px;">'+formatRupiah(total)+'</b></li>')

      },
      error: function(xhr, status, error) {
          console.error('Error:', error);
      }
  });
}
function getOrangBaik(urlBase,spreadsheetId,apiKey,seasonName){
  let columnRange = 'E3:E62'
  let url = generateURL(urlBase,spreadsheetId,apiKey,seasonName,columnRange)
  $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        var target = $('#data-orangbaik');
        target.empty()
        $.each(data.values, function(index, row) {
            if(row[0]!=''){
              var html = '<div class="col-lg-3">'+
                            '<div class="pricing-item d-flex justify-content-between">'+
                              '<h3>'+row[0]+'</h3>'+
                            '</div>'+
                          '</div>'
              target.append(html)
            }
        });

      },
      error: function(xhr, status, error) {
          console.error('Error:', error);
      }
  });
}
// ===============================================================================
$(document).ready(function() {
  loadContent('home');
  generateSeasonMenu(urlBase,spreadsheetId,apiKey)
});
// ===============================================================================