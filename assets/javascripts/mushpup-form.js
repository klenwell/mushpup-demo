
var MushpupForm = (function() {
  var MUSH_TIMEOUT = 15;  // seconds

  var prepareRuler = function() {
    var upperRuler = '>***5****0****5****0***>';
    var lowerRuler = '<***0****5****0****5***<';
    var groups = ['west', 'central', 'east'];
    var $upperRuler = $('div.upper.ruler');
    var $lowerRuler = $('div.lower.ruler');

    // Build groups of ruler characters
    jQuery.each(groups, function(n, group) {
      var $upperGroup = $('<span />').addClass('upper group ' + group);
      var $lowerGroup = $('<span />').addClass('lower group ' + group);

      for (var i=0; i < 8; i++) {
        var index = n * 8 + i;
        var upperChar = upperRuler[index].replace('*', '&bull;');
        var lowerChar = lowerRuler[index].replace('*', '&bull;');
        var $upperSpan = $('<span />').addClass('c').html(upperChar);
        var $lowerSpan = $('<span />').addClass('c').html(lowerChar);
        $upperGroup.append($upperSpan);
        $lowerGroup.append($lowerSpan);
      }

      $upperRuler.append($upperGroup);
      $lowerRuler.append($lowerGroup);
    });
  };

  var prepareButtonHandler = function() {
    var $mushButton = $('button.mush');
    var unmushTimer;
    $mushButton.data('form-open', true);

    $mushButton.on('click', function() {
      // Toggle state
      var formOpen = !!($mushButton.data('form-open'));
      var newFormState = !(formOpen);
      var setFormState = function() {
        $mushButton.data('form-open', newFormState)
      }

      // Form submitted
      if ( formOpen ) {
        var hash = generateHash();
        validateInput();
        updateHash(hash);
        $mushButton.text('unmush');

        // Unmush after given period of time
        clearTimeout(unmushTimer);
        unmushTimer = setTimeout(function() {
          $mushButton.click();
        }, MUSH_TIMEOUT * 1000);
      }

      // Form reset
      else {
        clearTimeout(unmushTimer);
        $mushButton.text('mush');
        updateHash('------------------------');
      }

      // Toggle
      $('fieldset.locus-pocus').slideToggle('slow', setFormState);
      $('panel.reveal').slideToggle('slow', setFormState);

      return false;
    });
  };

  var generateHash = function() {
    var locus = $('input#locus').val().trim();
    var pocus = $('input#pocus').val().trim();
    return Mushpup.mush(locus, pocus);
  };

  var updateHash = function(hashCode) {
    var groups = ['west', 'central', 'east'];
    var hashCodeLetters = hashCode.split('');

    // Empty hash row
    var $hashRow = $('panel.reveal div.hash');
    $hashRow.empty();

    // Build groups of ruler characters
    jQuery.each(groups, function(n, group) {
      var $hashGroup = $('<span />').addClass('group ' + group);

      for (var i=0; i < 8; i++) {
        var index = n * 8 + i;
        var letter = hashCodeLetters[index];
        var $letterSpan = $('<span />').addClass('c').text(letter);
        $hashGroup.append($letterSpan);
      }

      $hashRow.append($hashGroup);
    });
  };

  var validateInput = function() {
    var $warnings = $('panel.reveal div.warnings');
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
