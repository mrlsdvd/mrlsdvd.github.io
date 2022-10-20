OUTDOORS_LOG_ENTRY_COMPONENT_PATH = "./assets/html/components/outdoors_log_entry.html"


$().ready(function() {
   /**
    * Begin with desired content as default
    */
    
    // Load config data
    $.getJSON("/config.json", function(data) {
        // Sort objects by date
        let sortedEntryInfo = data.outdoors.posts.sort(getObjectComparator('date'), true);

        sortedEntryInfo.forEach((postInfo, idx) => {
            let markdownInfo = data.data.markdown[postInfo.markdownId];
            let postTitle = postInfo.title;
            let postId = postInfo.id;
            $("#outdoors-outline").append(`<a class="log-outline-item" id="log-outline-item-${postId}">${postTitle}</a>`)
        });
        //Show most recent post
        let recentPostInfo = sortedEntryInfo[0];
        focusOnPost(recentPostInfo, data);

    });
});


function focusOnPost(postInfo, data) {
    // Validate that postID exists
    // TODO: When adding pagination, entry will not exist yet, so will need to load
    // Set URL to mirror post
    // Open post modal

    let markdownInfo = data.data.markdown[postInfo.markdownId];
    // Load  entry HTML template:
    $.get(OUTDOORS_LOG_ENTRY_COMPONENT_PATH, function(logTemplate) {
        entryHTML = constructOutdoorEntryHTML(logTemplate, postInfo, markdownInfo);
        $("#outdoors-entry-col").html(entryHTML);
        // Highlight post in outline
        $(".log-outline-item").removeClass('active');
        $("#log-outline-item-${postId}").addClass('active');
    });
}

function getPost(postId) {
    // Load photo from config and show as modal (for cases where photo is needed but not yet loaded)
    // Exiting will remove photo
}

function constructOutdoorEntryHTML(logTemplate, postInfo, markdownInfo) {
    fullTagsHTML = constructTagsHTML(postInfo.tags, false);
    templateEntries = {
        "postId": postInfo.postId,
        "entryMarkdownPath": markdownInfo.path,
        "title": postInfo.title,
        "postDate": postInfo.date,
        "postTags": fullTagsHTML
    };
    
    logEntry = logTemplate.format(templateEntries);
    return logEntry;
}