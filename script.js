$(document).ready(function(){
  $("#words").draggable();
  $("#circle").droppable({
    over: function() {
      $("#button").css("color", "white");
    },
    out: function() {
      $("#button").css("color", "transparent");
    }
  });
});