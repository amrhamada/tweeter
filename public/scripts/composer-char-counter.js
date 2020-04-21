$(document).ready(function() {
  $('#tweet-text').keyup(function () {
    const text = $(this).val();
    const letterCount = text.trim().length;
    $(this).parent().children('.counter').html(140 - letterCount);

    if (140 - letterCount < 0) {
      $(this).parent().children('.counter').addClass('limit-exceeded');
    } else {
      $(this).parent().children('.counter').removeClass('limit-exceeded');
    }


  });
});