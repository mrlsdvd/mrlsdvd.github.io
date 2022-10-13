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


function setMainContent(navName) {
    $('#main-content').load('/assets/content/' + navName +'.html');
}
