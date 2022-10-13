$().ready(function() {
   /**
    * Add listeners to the beginning of the page creation 
    */
    // Navigation listeners
    $(".nav-link").click(function() {
        $(".nav-link").removeClass('active');
        $(this).addClass('active');
        updateContent($(this).attr('id'))
    });

});


function updateContent(nav_name) {
    $('#main-content').load('/${nav_name}.html');
}
