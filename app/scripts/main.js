(function () {

  'use strict';

  $('.edit-toggle').on('click', function () {
    $('.edit-dialog').toggleClass('edit-dialog-open');
  });

  $('.style-toggle').on('click', function () {
    $('body').toggleClass('style-change');
  });

  $('.menu-toggle').on('click', function () {
    $('.filter-dialog').toggleClass('filter-dialog-open');
  });

  $('.btn-action-primary').on('click', function(){
    //save the form
    });

})();

