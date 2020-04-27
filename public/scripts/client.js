/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
//  */


const textLengthError = '❌ Character Limit exceeded! ❌'
const emptyError = '❌ Empty Tweet! ❌';

//calculate and return the tweet time Stamp
//if > year than print date posted
// if > month print how many months
// if > days return day and if less return hour then minute
// only one type is return edex "1 month ago" never  "1 month 3 hours 2muntes and 43 seconds ago" is returned
function dateDiff(startDate, endDate) {
  const startYear = startDate.getFullYear();
  const february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
  const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let years = endDate.getFullYear() - startYear;
  let months = endDate.getMonth() - startDate.getMonth();
  if (months < 0) {
      years--;
      months += 12;
  }
  let days = endDate.getDate() - startDate.getDate();
  if (days< 0) {
      if (months > 0) {
          months--;
      } else {
          years--;
          months = 11;
      }
      days += daysInMonth[startDate.getMonth()];
  }
  let hours = endDate.getHours() - startDate.getHours();
  let minutes = endDate.getMinutes() - startDate.getMinutes();
  let seconds = endDate.getSeconds() - startDate.getSeconds();

  if (years > 0) {
    return startDate.toDateString();
  }
  if (months > 0) {
    if (months === 1 && days < 0) {
      return `${daysInMonth[startDate.getMonth()] +days} ${daysInMonth[startDate.getMonth()] + days > 1 ? "Days Ago":"Day ago"}`;
    }
    return `${Math.abs(months)} ${Math.abs(months) > 1 ? "Months Ago":"Month ago"}`;
  }

  if (days > 0) {
    if (days === 1 && hours< 0) {
      return `${24 + hours} ${24 + hours > 1 ? "Hours Ago":"Hour ago"}`;
    }
    return `${Math.abs(days)} ${Math.abs(days) > 1 ? "Days Ago":"Day ago"}`;
  }

  if (hours > 0) {
    if (hours === 1 && minutes< 0) {
      return `${Math.abs(60 + minutes)} ${60 + minutes> 1 ? "Minutes Ago":"Minute ago"}`;
    }
    return `${Math.abs(hours)} ${Math.abs(hours) > 1 ? "Hours Ago":"Hour ago"}`;
  }

  if (minutes > 0) {
    if (minutes === 1 && seconds< 0) {
      return `${ 60 +seconds} ${60 + seconds > 1 ? "Seconds Ago":"Second ago"}`;
    }
    return `${Math.abs(minutes)} ${Math.abs(minutes) > 1 ? "Minutes Ago":"Minute ago"}`;
  }

  return `${Math.abs(seconds)} ${Math.abs(seconds) > 1 ? "Seconds Ago":"Second ago"}`;
  
}

const createTweetElement = function(tweet) {
  const postedDate = new Date(tweet.created_at);
  const todaysDate = new Date();  
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
        <p>${dateDiff(postedDate, todaysDate)}</p>
        <span class="tweet-icons">
        <img src="./images/flag-icon.png" title="Save" alt="Bookmark tweet">
        <img src="./images/retweet-icon.png" title="Retweet" alt="retweet tweet">
        <img src="./images/like-icon.png" title="Like" alt="Like tweet">
        </span>
      </footer>
    </article>`;
  return markup;
};

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
  const $top = $('#go-top');

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function() { 
    scrollFunction()
  };

  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      $top.css('display' , () => "block");
    } else {
      $top.css('display' , () => "none");
    }
  };
  
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
    }).then( function() {
      loadTweets();
      // $('.new-tweet').slideUp();
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
  };

  loadTweets();
});

const showNewTweet = () => {
  $newTweet = $('.new-tweet');
  if ($newTweet.css('display') === 'none') {
    $newTweet.slideDown();
    $('.new-tweet output').val(140);
    $('.new-tweet textarea').focus();
  } else {
    $newTweet.slideUp();
  }
};
 
  
