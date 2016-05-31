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

  var storage = {
    items: [
      {
        id: 1,
        status: 0,
        title: 'Website erstellen',
        description: 'Dies ist ein Typoblindtext. An ihm kann man sehen, ob alle Buchstaben da sind und wie sie aussehen.',
        priority: 5,
        duedate: '2016-08-01'
      },
      {
        id: 2,
        status: 1,
        title: 'Blumentopf kaufen',
        description: 'Manchmal benutzt man Worte wie Hamburgefonts, Rafgenduks oder Handgloves, um Schriften zu testen. Manchmal Sätze, die alle Buchstaben des Alphabets enthalten - man nennt diese Sätze Pangrams.',
        priority: 3,
        duedate: '2016-07-11'
      },
      {
        id: 3,
        status: 1,
        title: 'Eine schlaue Aufgabe ausdenken und diese dann als Notiz hier erfassen',
        description: 'Manchmal benutzt man Worte wie Hamburgefonts, Rafgenduks oder Handgloves, um Schriften zu testen. Manchmal Sätze, die alle Buchstaben des Alphabets enthalten - man nennt diese Sätze Pangrams.',
        priority: 4,
        duedate: '2016-05-31'
      }
    ]
  };

  var noteItemTemlpate = $('#node_item_template').html();
  var noteItems = Handlebars.compile(noteItemTemlpate);
  $('.note_list').append(noteItems(storage));

})();

