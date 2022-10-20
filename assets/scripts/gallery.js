GALLERY_ENTRY_COMPONENT_PATH = "./assets/html/components/gallery_entry.html"
NUM_COLS = 3
SUPPORTED_PAGES = ['about', 'programming', 'outdoors', 'art', 'photography', 'travel', 'albums']


$().ready(function() {
   /**
    * Begin with desired content as default
    */
    let pageIdentifier = window.location.href.split(MAIN_URL)[1].split('#');
    let navName = pageIdentifier[0].toLowerCase();
    let entryId = pageIdentifier[1];
    let pageBaseURL = MAIN_URL+navName

    // Load photo entry HTML template:
    $.get(GALLERY_ENTRY_COMPONENT_PATH, function(template) {
        // Load config data
        $.getJSON("/config.json", function(data) {
            // Sort objects by date
            let sortedEntryInfo = getEntries(data, navName, true, "date", true);
            let numCols = NUM_COLS

            sortedEntryInfo.forEach((entryInfo, idx) => {
                let colIdx = idx % NUM_COLS;
                imageInfo = data.data.images[entryInfo.imageId];
                entryHTML = constructEntryHTML(template, entryInfo, imageInfo);
                $(".gallery #gallery-col-"+colIdx).append(entryHTML);
                
            });
        });
    });
    
    // Add listeners to each modal -- when the modal shows, update the url path
    $(document).on("shown.bs.modal", ".modal", function() {
        console.log("modal shown")
        let identifier = $(this).attr("id").split('-').pop();
        if (identifier != null) {
            pageURL = pageBaseURL + "#" + identifier;
        }
        window.history.replaceState(null, null, pageURL)
    });

    if (entryId != undefined) {
        focusOnEntry(entryId, navName);
    }
    // When the modal hides, remove from the url path
    $(document).on("hidden.bs.modal", ".modal", function() {
        console.log("modal hidden")
        window.history.replaceState(null, null, pageBaseURL)
    });

});

function focusOnEntry(entryId, navName) {
    $.getJSON("/config.json", function(data) {
        let sortedEntryInfo = getEntries(data, navName, true, "date", true);
        sortedEntryInfo.forEach((entryInfo, idx) => {
            if (entryInfo.id == entryId) {
                let imageInfo = data.data.images[entryInfo.imageId];
                // Load  entry HTML template:
                $.get(GALLERY_ENTRY_COMPONENT_PATH, function(template) {
                    entryHTML = constructEntryHTML(template, entryInfo, imageInfo);
                    $($.parseHTML(entryHTML)).find("#gallery-modal-"+entryInfo.id).modal("toggle");
                });
            }
        });
    });
}

function getEntries(data, navName, sorted=true, sortBy="date", desc=true) {
    let entries = null;
    switch(navName) {
        case "art":
            entries = data.art.works
            break;
        default:
            entries = data.photography.photos
    }
    if (sorted) {return entries.sort(getObjectComparator(sortBy, desc));}
    return entries
}

function constructEntryHTML(template, entryInfo, imageInfo) {
    truncatedTagsHTML = constructTagsHTML(entryInfo.tags);
    fullTagsHTML = constructTagsHTML(entryInfo.tags, false);
    templateEntries = {
        "imageId": entryInfo.id,
        "imagePath": imageInfo.path,
        "orientation": entryInfo.orientation,
        "title": entryInfo.title,
        "caption": entryInfo.caption,
        "options": entryInfo.settings,
        "description": entryInfo.description,
        "galleryTags": truncatedTagsHTML,
        "modalTags": fullTagsHTML
    };
    
    entryHTML = template.format(templateEntries);
    return entryHTML;
}