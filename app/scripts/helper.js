'use strict';

/**
 * helper
 */

Handlebars.registerHelper('formattedDate', function(data) {

  //console.log('date in registeredHelper '+ data.toString());
  if(data === 0) {
    return '';
  }
  var date = new Date(data);
  return getFormattedDate(date);
});

function getFormattedDate(date){

  var d = date;
  var month = (d.getMonth() + 1);
  var day = d.getDate();

  if(month < 10) {
    month = '0' + month;
  }
  if(day < 10) {
    day = '0' + day;
  }
  return d.getFullYear() + '-' + month + '-' + day;
}

function getToday(){
  return getFormattedDate(new Date(Date.now()));
}

function getTomorrow(){
  return getFormattedDate(new Date(Date.now()+24*60*60*1000));
}

function setCookie (name, value, expiry){
  document.cookie = name + '=' + encodeURIComponent(value) +
    '; max-age=' + 60 * 60 * 24 * expiry +
    '; path=/';
}

function getCookie (name){
  var cookies = document.cookie;
  if (cookies && cookies.length != 0) {
    var val = cookies.match('(^|;)[\s]*' + name + '=([^;]*)');
    if (val && val[2]) {
      return decodeURIComponent(val[2]);
    }
  }
  return '' ;
}

function toggleEditMask(state){
  if(state == 'show') {
    $('.edit-dialog-backdrop').addClass('active');
    $('.edit-dialog').addClass('active');
    if($('.edit-dialog').data('mode') === 'add') {
      $('.edit-mask-delete-button').hide();
    }
  }
  else {
    $('.edit-dialog-backdrop').removeClass('active');
    $('.edit-dialog').removeClass('active').data('mode', '').data('index', '');
    $('#edit-mask')[0].reset();
    $('.edit-mask-delete-button').show();
  }
}

function updateSortIndicators($current, order){
  $('.js-sort-indicator').removeClass('fa-sort fa-sort-asc fa-sort-desc').parent().removeClass('active');
  $current.find('.js-sort-indicator').addClass('fa-sort-'+order).parent().addClass('active');
}
