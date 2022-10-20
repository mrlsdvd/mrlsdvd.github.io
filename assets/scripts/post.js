LOG_ENTRY_COMPONENT_PATH = "./assets/html/components/log_entry.html"


$().ready(function() {
   /**
    * Begin with desired content as default
    */
    let pageIdentifier = window.location.href.split(MAIN_URL)[1].split('#');
    let navName = pageIdentifier[0].toLowerCase();
    let entryId = pageIdentifier[1];
    let pageBaseURL = MAIN_URL+navName

    // Load config data
    $.getJSON("/config.json", function(data) {
        // Sort objects by date
        let sortedEntryInfo = data.outdoors.posts.sort(getObjectComparator('date', true));

        sortedEntryInfo.forEach((postInfo, idx) => {
            let markdownInfo = data.data.markdown[postInfo.markdownId];
            let postTitle = postInfo.title;
            let postId = postInfo.id;
            $(".outline").append(`<a class="list-group-item log-outline-item" id="log-outline-item-${postId}">${postTitle}</a>`)
        });
        // Apply listener to each outline item to focus on
        $(".log-outline-item").click(function(){
            let postId = $(this).attr('id').split('-').pop();
            focusOnPost(postId);
            if (postId != null) {
                pageURL = pageBaseURL + "#" + postId;
            }
            window.history.replaceState(null, null, pageURL)
        });
        //Show most recent post
        let recentPostId = sortedEntryInfo[0].id;
        if (entryId != undefined) { 
            focusOnEntry(entryId, navName);
        } else { 
            focusOnPost(recentPostId, navName);
        }
        

    });
});


function focusOnPost(postId) {
    $.getJSON("/config.json", function(data) {
        let sortedEntryInfo = getEntries(data, navName, true, "date", true);
        sortedEntryInfo.forEach((postInfo, idx) => {
            if (postInfo.id == postId) {
                let markdownInfo = data.data.markdown[postInfo.markdownId];
                let postTitle = postInfo.title;
                let postId = postInfo.id;
                // Load  entry HTML template:
                $.get(LOG_ENTRY_COMPONENT_PATH, function(logTemplate) {
                    entryHTML = constructPostHTML(logTemplate, postInfo, markdownInfo);
                    console.log(entryHTML);
                    $("#.entry-col").html(entryHTML);
                    // Highlight post in outline
                    $(".log-outline-item").removeClass('active');
                    $("#log-outline-item-"+postId).addClass('active');
                });
            }
        });
    });
    
}

function getEntries(data, navName, sorted=true, sortBy="date", desc=true) {
    let entries = null;
    switch(navName) {
        case "travel":
            entries = data.travel.posts;
            break;
        case "programming":
            entries = data.programming.posts;
        default:
            entries = data.outdoors.posts;
    }
    if (sorted) {return entries.sort(getObjectComparator(sortBy, desc));}
    return entries;
}

function constructPostHTML(logTemplate, postInfo, markdownInfo) {
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