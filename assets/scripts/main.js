MAIN_URL = 'https://mrlsdvd.github.io/'
SUPPORTED_PAGES = ['about', 'programming', 'outdoors', 'art', 'photography', 'travel', 'albums']

$().ready(function() {
   /**
    * Begin with desired content as default
    */
    var pageName = window.location.href.split(MAIN_URL)[1].toLowerCase()
    if (!SUPPORTED_PAGES.includes(pageName)) {pageName = 'about'}
    setMainContent(pageName);
    // Make that navigation tab active
    $(".nav-link").removeClass('active');
    $("#nav-"+pageName).addClass('active')
    
   /**
    * Add listeners to the beginning of the page creation 
    */
    // Navigation listeners
    $(".nav-link").click(function() {
        $(".nav-link").removeClass('active');
        $(this).addClass('active');
        setMainContent($(this).attr('id').split('-').pop());
    });

    // Search listener
    $("#search-form").submit(function(e){
        e.preventDefault()
        var pageName = $(".nav-link.active").attr('id').split('-').pop()
        searchContent($("#search-bar").text(), pageName);
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

function searchContent(query, navName) {
    console.log("Searching {0} under page {1}".format(query, navName))
}
