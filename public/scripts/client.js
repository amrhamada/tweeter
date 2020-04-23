/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
//  */


const textLengthError = '❌ Character Limit exceeded! ❌'
const emptyError = '❌ Empty Tweet! ❌';

const createTweetElement = function(tweet) {
  
  const markup = `
    <article>
      <header>
        <img src="${tweet.user.avatars}" title="users avatar">
        <p>${tweet.user.name}</p>
        <p class="tag">${tweet.user.handle}
      </header>
      <div>
        ${$('<p>').text(tweet.content.text)[0].outerHTML}
      </div>
      <hr>
      <footer>
        <p>10 Days Ago</p>
      </footer>
    </article>`;
    // console.log(markup.split("\n"));
    return markup;

};



// $(document).ready(function() {

const renderTweets = (tweets) =>{
  let markup = [];
  for (const tweet of tweets) {
    markup.unshift(createTweetElement(tweet));
  }
  $('#tweet-list').empty();
  $('#tweet-list').append(markup.join(""));
    
  
};

$(document).ready(function() {

  //Get the button
  const $top = $('#go-top')

// When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      $top.css('display' , () => "block");
    } else {
      $top.css('display' , () => "none");
    }
  }
  
  $('form').submit( function(event) {
    event.preventDefault();
    if (!$('#tweet-text').val()) {
      $('#error').text(emptyError).slideDown();
      setTimeout(()=> $('#error').text('').slideUp(), 5000);
      return;
    } 
    if ($('output').val() < 0) {
      $('#error').text(textLengthError).slideDown();
      return;
    }
    $('#error').text('').slideUp();

    const tweet = $('#tweet-text').serialize();
    $.ajax({
      url: '/tweets',
      type: 'POST',
      data: tweet
    }).then( function(response) {
      loadTweets();
      $('.new-tweet').slideUp();
    }).catch(error => {
      $('#error').text(' ❌Failed to post please try again❌').slideDown()
      return;
    });
  }); 

  const loadTweets = () => {
    $.ajax({
      url:'/tweets',
      type:"GET"
    }).then(response => {
      $('#tweet-text').val('');
      renderTweets(response);
      
    });
  }

  loadTweets();
});

const showNewTweet = () => {
  $newTweet = $('.new-tweet')
  if ($newTweet.css('display') === 'none') {
    $newTweet.slideDown();
    $('.new-tweet output').val(140);
    $('.new-tweet textarea').focus();
  } else {
    $newTweet.slideUp();
  }
};
 
  
