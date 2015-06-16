
var MushpupForm = (function() {
  var prepareRuler = function() {
    var upperRuler = '>***5****0****5****0***>',
        lowerRuler = '<***0****5****0****5***<';

    jQuery.each(upperRuler.split(''), function(n, letter) {
      var groupClass = '';

      if ( n < 8 ) {
        groupClass = 'west';
      }
      else if ( n < 16 ) {
        groupClass = 'central';
      }
      else {
        groupClass = 'east';
      }

      var $upperSpan = $('<span />')
        .addClass('c ruler')
        .addClass(groupClass)
        .html(upperRuler[n].replace('*', '&bull;'));
      var $lowerSpan = $('<span />')
        .addClass('c ruler')
        .addClass(groupClass)
        .html(lowerRuler[n].replace('*', '&bull;'));

      $('div#upper-ruler').append($upperSpan);
      $('div#lower-ruler').append($lowerSpan);
    });
  };

  var prepareButtonHandler = function() {
    $('#mush').data('form-open', true);

    $('#mush').on('click', function() {
      // Toggle state
      var formOpen = !!($('#mush').data('form-open'));
      var newFormState = !(formOpen);
      var setFormState = function() {
        $('#mush').data('form-open', newFormState)
      }

      // Form submitted
      if ( formOpen ) {
        var hash = generateHash();
        validateInput();
        updateHash(hash);
        $('button#mush').text('unmush');
      }

      // Form reset
      else {
        $('button#mush').text('mush');
        updateHash('------------------------');
      }

      // Toggle
      $('fieldset#locus-pocus').slideToggle('slow', setFormState);
      $('panel#hash').slideToggle('slow', setFormState);
      return false;
    });
  };

  var generateHash = function() {
    var locus = $('input#locus').val().trim();
    var pocus = $('input#pocus').val().trim();
    return Mushpup.mush(locus, pocus);
  };

  var updateHash = function(hashCode) {
    var $hashRow = $('div#hash-row');
    $hashRow.empty();

    jQuery.each(hashCode.split(''), function(n, letter) {
      var $letterSpan = $('<span />').addClass('c hash').text(letter);
      $hashRow.append($letterSpan);
    });
  };

  var validateInput = function() {
    var $warnings = $('#warnings');
    var site = $('input#locus').val().trim();
    var msw = $('input#pocus').val().trim();

    // Clear any warning
    $warnings.empty();

    // Add any new warnings
    var addWarning = function(message, style) {
      style = (! style) ? 'warning' : style;
      var alertClass = 'alert alert-dismissible alert-' + style;
      var $button = $([
        '<button type="button" class="close" data-dismiss="alert">',
        '<span aria-hidden="true">&times;</span>',
        '<span class="sr-only">Close</span>',
        '</button>'].join('\n'));
      var $messageSpan = $('<span />').text(message);
      var $alert = $('<div role="alert" />')
        .addClass(alertClass)
        .append($button)
        .append($messageSpan);
      $warnings.append($alert);
    }

    if ( ! site ) {
      addWarning('Site field was empty');
    }

    if ( ! msw ) {
      addWarning('Mushpup Secret Word field was empty')
    }
  };

  // API
  return {
    init: function() {
      prepareRuler();
      prepareButtonHandler();
      console.debug('Mushpup form init');
    },

  };
})();

$(document).ready(function() {
  MushpupForm.init();
});
