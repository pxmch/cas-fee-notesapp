(function () {

  'use strict';

  $('.edit-toggle').on('click', function () {
    $('.edit-dialog').toggleClass('edit-dialog-open');
  });

  $('.style-toggle').on('click', function () {
    $('body').toggleClass('style-change');
  });

})();

