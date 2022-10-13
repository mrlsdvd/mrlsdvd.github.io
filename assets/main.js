$().ready(function() {
   /**
    * Begin with about content as default
    */
    updateContent('about')
    
   /**
    * Add listeners to the beginning of the page creation 
    */
    // Navigation listeners
    $(".nav-link").click(function() {
        $(".nav-link").removeClass('active');
        $(this).addClass('active');
        updateContent($(this).attr('id').split('-').pop())
    });

});


function updateContent(nav_name) {
    $('#main-content').load('/assets/' + nav_name +'.html');
}
