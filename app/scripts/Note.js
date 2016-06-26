'use strict';

/**
 * Class Note
 */

function Note(title, description, priority, duedate, isDone, finishdate, _id) {
  var self = this;
  self._id = (typeof _id != 'undefined') ? _id : null;
  self.title = title;
  self.description = description;
  self.priority = (typeof priority != 'undefined' && !isNaN(priority)) ? priority : 0;;
  self.duedate = (typeof duedate != 'undefined' && !isNaN(duedate)) ? duedate : 0;
  self.isDone = (typeof isDone != 'undefined') ? isDone : false;
  self.createdate = Date.now();
  self.finishdate = finishdate;
}
