OUTDOORS_LOG_ENTRY_COMPONENT_PATH = "./assets/html/components/outdoors_log_entry.html"


$().ready(function() {
   /**
    * Begin with desired content as default
    */
    
    // Load config data
    $.getJSON("/config.json", function(data) {
        // Sort objects by date
        let sortedEntryInfo = data.outdoors.posts.sort(getObjectComparator('date', true));

        sortedEntryInfo.forEach((postInfo, idx) => {
            let markdownInfo = data.data.markdown[postInfo.markdownId];
            let postTitle = postInfo.title;
            let postId = postInfo.id;
            $("#outdoors-outline").append(`<a class="list-group-item log-outline-item" id="log-outline-item-${postId}">${postTitle}</a>`)
        });
        // Apply listener to each outline item to focus on
        $(".log-outline-item").click(function(){
            let postId = $(this).attr('id').split('-').pop();
            focusOnPost(postId);
        });
        //Show most recent post
        let recentPostId = sortedEntryInfo[0].id;
        focusOnPost(recentPosId);

    });
});


function focusOnPost(postId) {
    $.getJSON("/config.json", function(data) {
        let sortedEntryInfo = data.outdoors.posts.sort(getObjectComparator('date', true));
        var postFound = false;
        sortedEntryInfo.forEach((postInfo, idx) => {
            if (postInfo.id == postId) {
                postFound = true
                let markdownInfo = data.data.markdown[postInfo.markdownId];
                let postTitle = postInfo.title;
                let postId = postInfo.id;
                // Load  entry HTML template:
                $.get(OUTDOORS_LOG_ENTRY_COMPONENT_PATH, function(logTemplate) {
                    console.log(markdownInfo);
                    console.log(postId);
                    entryHTML = constructOutdoorEntryHTML(logTemplate, postInfo, markdownInfo);
                    console.log(entryHTML);
                    $("#outdoors-entry-col").html(entryHTML);
                    // Highlight post in outline
                    $(".log-outline-item").removeClass('active');
                    $("#log-outline-item-"+postId).addClass('active');
                });
            }
            if (!postFound) { alert("Id not found") }
            let recentPostId = sortedEntryInfo[0].id;
            focusOnPost(recentPosId);
        });
    });
    
}

function getPost(postId) {
    // Load photo from config and show as modal (for cases where photo is needed but not yet loaded)
    // Exiting will remove photo
}

function constructOutdoorEntryHTML(logTemplate, postInfo, markdownInfo) {
    fullTagsHTML = constructTagsHTML(postInfo.tags, false);
    templateEntries = {
        "postId": postInfo.id,
        "entryMarkdownPath": markdownInfo.path,
        "title": postInfo.title,
        "postDate": postInfo.date,
        "postTags": fullTagsHTML
    };
    
    logEntry = logTemplate.format(templateEntries);
    return logEntry;
}