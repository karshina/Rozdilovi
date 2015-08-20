$(document).ready(function(){
  $("#words").draggable();
  $("#field").droppable({
    over: function() {
      $("#button").css("color", "white");
    },
    out: function() {
      $("#button").css("color", "transparent");
    }
  });
});