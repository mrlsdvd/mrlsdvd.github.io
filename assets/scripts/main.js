MAIN_URL = 'https://mrlsdvd.github.io/'

$().ready(function() {
   /**
    * Begin with about content as default
    */
    setMainContent('about')
    
   /**
    * Add listeners to the beginning of the page creation 
    */
    // Navigation listeners
    $(".nav-link").click(function() {
        $(".nav-link").removeClass('active');
        $(this).addClass('active');
        setMainContent($(this).attr('id').split('-').pop())
    });

});

/**
 * Adopted from SO solution here: https://stackoverflow.com/questions/13639464/javascript-equivalent-to-pythons-format
 * Allows python-like formatting of strings to accomodate re-usable string templates
 */
String.prototype.format = function() {
  var args = arguments;
  this.unkeyed_index = 0;
  return this.replace(/\{(\w*)\}/g, function(match, key) { 
    if (key === '') {
      key = this.unkeyed_index;
      this.unkeyed_index++
    }
    if (key == +key) {
      return args[key] !== 'undefined'
      ? args[key]
      : match;
    } else {
      for (var i = 0; i < args.length; i++) {
        if (typeof args[i] === 'object' && typeof args[i][key] !== 'undefined') {
          return args[i][key];
        }
      }
      return match;
    }
  }.bind(this));
};

function setMainContent(navName) {
    $('#main-content').load('/assets/html/' + navName +'.html');
    window.history.replaceState(null, null, MAIN_URL+navName)
}
