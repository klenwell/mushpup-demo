
var MushpupForm = (function() {
  // Constants
  var MUSH_TIMEOUT = 15;  // seconds
  var RESET_TIMEOUT = 60;

  // Globals
  var unmushTimer;
  var resetTimer;
  var $mushButton = $('button.mush');

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

  var prepareMushButtonHandler = function() {
    $mushButton.data('form-open', true);

    $mushButton.on('click', function() {
      // Form submitted -> mush
      if ( formIsOpen() ) {
        var hash = generateHash();
        validateInput();
        updateHash(hash);
        $mushButton.text('unmush');

        // Unmush after given period of time
        clearTimeout(unmushTimer);
        unmushTimer = setTimeout(function() {
          $mushButton.click();
        }, MUSH_TIMEOUT * 1000);

        // Reset form completely after given period of time
        restartResetTimer();
      }

      // Unmush
      else {
        clearTimeout(unmushTimer);
        clearPayload();
        restartResetTimer();
      }

      toggleForm();
      return false;
    });
  };

  var prepareResetButtonHandler = function() {
    $('span.button.reset').on('click', function() {
      resetForm();
    });
  };

  var prepareConfirmButtonHandler = function() {
    $('span.button.confirm').on('click', function() {
      toggleConfirmField();
    });
  };

  var toggleForm = function() {
    $('fieldset.locus-pocus').slideToggle('slow');
    $('panel.reveal').slideToggle('slow', swapFormState);
  };

  var showForm = function() {
    $('fieldset.locus-pocus').slideDown('slow', function() {
      $mushButton.data('form-open', true);
    });
    $('panel.reveal').slideUp('slow');
  };

  var clearInputFields = function() {
    $('input#locus').val('');
    $('input#pocus').val('');
    $('input#pocus-confirm').val('');
  };

  var clearPayload = function() {
    $mushButton.text('mush');
    var hash = '------------------------'.replace(/-/g, '•');
    updateHash(hash);
  };

  var resetForm = function() {
    clearTimeout(unmushTimer);
    clearTimeout(resetTimer);
    clearPayload();
    clearInputFields();
    rollupConfirmField();
    showForm();
  };

  var toggleConfirmField = function() {
    $('div.confirmation').slideToggle('slow');
  };

  var rollupConfirmField = function() {
    if ( $("div.confirmation").is(":visible") ) {
      toggleConfirmField();
    }
  };

  var restartResetTimer = function() {
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function() {
      resetForm();
    }, RESET_TIMEOUT * 1000);
  };

  var swapFormState = function() {
    $mushButton.data('form-open', !(formIsOpen()));
  };

  var formIsOpen = function() {
    return !!($mushButton.data('form-open'));
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
      prepareMushButtonHandler();
      prepareResetButtonHandler();
      prepareConfirmButtonHandler();
    }
  };
})();
