var exam_room_events = {
  enter_room: show_exam_room,
  exit_room: hide_exam_room,
  countdown: start_counter,
  iphone_questions: {},
  phone_questions: {},
  mouse_questions: {},
  poster1_questions: {},
  poster2_questions: {},
  tv_questions: {},
  total_points: 0,
  all_scenarios: ['iphone', 'phone', 'mouse', 'poster1', 'poster2'],
  finished_scenarios: [],
  the_case_study: '',
  update_ticker: change_ticker_text,
  ticker_text: default_ticker_text,
};

function change_ticker_text(text) {
  $('.ticker .content').attr('data-marquee', text);
}

function show_exam_room(case_study) {
  exam_room_events.the_case_study = case_study;
  set_exam_room_assets(case_study);
  exam_room_events.update_ticker(exam_room_events.ticker_text());
  $('.container .exam-room').show();
  $('map').imageMapResize();
  exam_room_events.countdown();
}

function start_counter() {
  var thirty_min = 1800000;
  // var thirty_min = 7000;
  if (CountdownStarted == true) {
    CountDown.Resume(thirty_min);
  } else {
    CountDown.Start(thirty_min);
  }

}

function display_time(minutes, seconds) {
  $clock = $('.clock .content');
  $clock.find('.minutes').text(minutes);
  $clock.find('.seconds').text(seconds);
}

function set_exam_room_assets(case_study) {
  setup_questions(case_study);
  poster_1 = assets_events.exam_room_asset(case_study, 'poster1');
  poster_2 = assets_events.exam_room_asset(case_study, 'poster2');
  tv = assets_events.exam_room_asset(case_study, 'tv');

  $('.exam-room #poster1 img').attr('src', poster_1);
  $('.exam-room #poster2 img').attr('src', poster_2);
  set_score();
  update_exam_room_assets();
}


function setup_questions(case_study) {
  exam_room_events.iphone_questions = IPHONE[main_variables.language][case_study];
  exam_room_events.phone_questions = PHONE[main_variables.language][case_study];
  exam_room_events.mouse_questions = MOUSE[main_variables.language][case_study];
  exam_room_events.poster1_questions = POSTER1[main_variables.language][case_study];
  exam_room_events.poster2_questions = POSTER2[main_variables.language][case_study];
  exam_room_events.tv_questions = TV[main_variables.language][case_study];
}

function get_selected_questions(id) {
  questions = [];
  switch (id) {
    case 'iphone':
      questions = exam_room_events.iphone_questions; break;
    case 'phone':
      questions = exam_room_events.phone_questions; break;
    case 'mouse':
      questions = exam_room_events.mouse_questions; break;
    case 'poster1':
      questions = exam_room_events.poster1_questions; break;
    case 'poster2':
      questions = exam_room_events.poster2_questions; break;
    case 'tv':
      questions = exam_room_events.tv_questions; break;
  }

  return questions;
}

function array_equal(arr1, arr2) {
  return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
}

function hide_exam_room() {
  prompt_evaluation_screen(exam_room_events.the_case_study);
  clear_exam_room_assets();
  $('.container .exam-room').hide();
  enter_lobby();

  $.fancybox.close();
}

function clear_exam_room_assets() {
  CountDown.Pause();
  CountdownStarted = false;
  display_time('', '');
  exam_room_events.iphone_questions = {};
  exam_room_events.phone_questions = {};
  exam_room_events.mouse_questions = {};
  exam_room_events.poster1_questions = {};
  exam_room_events.poster2_questions = {};
  exam_room_events.tv_questions = {};
  exam_room_events.total_points = 0;
  exam_room_events.finished_scenarios = [];
  exam_room_events.the_case_study = '';
}

function default_ticker_text() {
  var case_study_text = lobby_events.case_study_texts[main_variables.language][exam_room_events.the_case_study];
  var default_texts = {
    en: "Welcome " + main_variables.employee_name + " to " + case_study_text,
    fr: "Welcome " + main_variables.employee_name + " to " + case_study_text
  }
  return default_texts[main_variables.language];
}

function pause_exam() {
  CountDown.Pause();
  $.fancybox({
    href: '#fb-break',
    closeBtn: false,
    width: '300px',
    height: 'auto',
    autoSize: false,
    helpers     : {
      overlay : {
        css      : {
            cursor : 'default'
        },
        closeClick: false
      }
    }
  });
}

function continue_exam() {
  CountDown.Resume();
  $.fancybox.close();
}

function prompt_evaluation_screen(case_study) {
  $('.evaluation-container').removeClass('hide');
  $('.bg-overlay').removeClass('hide').addClass('grey');
  $('.evaluation-container .evaluation-case-study').val(case_study);
}

function clear_evaluation() {
  $('.evaluation-container input[type="radio"]').prop('checked', false);
  $('.evaluation-container textarea').val('');
  $('.evaluation-container').addClass('hide');
  $('.bg-overlay').addClass('hide').removeClass('grey');
  $('.evaluation-container .first-slide').removeClass('hide');
  $('.evaluation-container .second-slide').addClass('hide');
  $('.evaluation-container .previous').addClass('hide');
  $('.evaluation-container .next').text("NEXT");
}


$(document).ready(function(){

  $('.evaluation-container').on('click', '.next', function(jsEvent) {
    jsEvent.stopPropagation();
    jsEvent.preventDefault();
    if ($(jsEvent.target).text() == "SUBMIT") {
      submit_evaluation();
      clear_evaluation();
    } else {
      $('.evaluation-container .first-slide').addClass('hide');
      $('.evaluation-container .second-slide').removeClass('hide');
      $('.evaluation-container .previous').removeClass('hide');
      $('.evaluation-container .next').text("SUBMIT");
    }
  });

  $('.evaluation-container').on('click', '.previous', function(jsEvent) {
    jsEvent.stopPropagation();
    jsEvent.preventDefault();
    $('.evaluation-container .first-slide').removeClass('hide');
    $('.evaluation-container .second-slide').addClass('hide');
    $('.evaluation-container .previous').addClass('hide');
    $('.evaluation-container .next').text("NEXT");
  });

  $('.exam-room').on('click', ".exam:not(.done)", function(jsEvent){
    start_exam($(jsEvent.target));
  });

  $('.exam-room .exams .next-btn').on('click', function(jsEvent) {
    $target = $(jsEvent.target);
    reference = get_next_prev_btn_reference($target, 'next').data('next-btn');
    eval(reference);
  });

  $('.exam-room .exams .back-btn').on('click', function(jsEvent) {
    $target = $(jsEvent.target);
    reference = get_next_prev_btn_reference($target, 'back').data('back-btn');
    eval(reference);
  });

  $('.exam-room .exit-trigger').on('click', function(jsEvent) {
    $target = $(jsEvent.target).parents('.exit-trigger').first();
    if ($target.hasClass('done')) {
      exam_room_events.exit_room();
    } else {
      $('#fb-warning .content').html('<div class="text">Are you sure you want to exit?<br />If you choose to exit now, your progress will not be saved.</div><div class="btn-container"><button class="red-btn" onclick="exam_room_events.exit_room();">Yes</button><button style="margin-left:10px;" class="blue-btn" onclick="$.fancybox.close();">Cancel</button></div>');
      $.fancybox({
        href: '#fb-warning',
        width: '400px'
      });
    }
  });

  $('.exam-room').on('click', '#break', function(jsEvent) {
    pause_exam();
  });


});