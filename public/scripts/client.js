/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
//  */


const textLengthError = '❌ Character Limit exceeded! ❌'
const emptyError = '❌ Empty Tweet! ❌';

const createTweetElement = function(tweet) {
  // const content = 
  // console.log(content);
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
  $('form').submit( function(event) {
    event.preventDefault();
    if (!$('#tweet-text').val()) {
      $('#error').text(emptyError).slideDown();
      setTimeout(()=> $('#error').text('').css('display', () => 'none'), 5000);
      return;
    } 
    if ($('output').val() < 0) {
      $('#error').text(textLengthError).slideDown();
      return;
    }
    $('#error').text('').css('display', () => 'none')
    // let tweet = $('#tweet-text').val();
    // console.log(tweet); 
    // tweet = $('#tweet-text').text(tweet);
    // console.log(tweet);
    // console.log($('#tweet-text').text($('#tweet-text').val()).val());
    const tweet = $('#tweet-text').serialize();
    $.ajax({
      url: '/tweets',
      type: 'POST',
      data: tweet
    }).then( function(response) {
      loadTweets()
    })
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


 
  
