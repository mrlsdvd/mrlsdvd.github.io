PHOTO_GALLERY_ENTRY_COMPONENT_PATH = "./assets/html/components/photo_gallery_entry.html"
NUM_COLS = 3
SUPPORTED_PAGES = ['about', 'programming', 'outdoors', 'art', 'photography', 'travel', 'albums']


$().ready(function() {
   /**
    * Begin with desired content as default
    */

    // Load photo entry HTML template:
    $.get(PHOTO_GALLERY_ENTRY_COMPONENT_PATH, function(photoTemplate) {
        // Load config data
        $.getJSON("/config.json", function(data) {
            // Sort objects by date
            let sortedPhotoInfo = data.photography.photos.sort(getObjectComparator('date', true));
            let numCols = NUM_COLS
            let numPhotos = sortedPhotoInfo.length;
            let prevRow = null;

            sortedPhotoInfo.forEach((photoInfo, idx) => {
                let colIdx = idx % NUM_COLS;
                imageInfo = data.data.images[photoInfo.imageId];
                entryHTML = constructPhotoEntryHTML(photoTemplate, photoInfo, imageInfo);
                $("#photo-gallery #gallery-col-"+colIdx).append(entryHTML);
                
            });
        });
    });
    let pageIdentifier = window.location.href.split(MAIN_URL)[1].split('#');
    let photoID = pageIdentifier[1];

    if (photoID != undefined) {
        focusOnPhoto(photoID);
    }

});

function focusOnPhoto(photoId) {
    // Validate that photoId exists
    // TODO: When adding pagination, entry will not exist yet, so will need to load
    // Set URL to mirror photo
    // Open photo modal
    $.getJSON("/config.json", function(data) {
        let sortedEntryInfo = data.outdoors.posts.sort(getObjectComparator('date', true));
        var photoFound = false;
        sortedEntryInfo.forEach((photoInfo, idx) => {
            if (photoInfo.id == photoId) {
                photoFound = true
                console.log(photoFound)
                let imageInfo = data.data.markdown[photoInfo.imageInfo];
                let photoTitle = photoInfo.title;
                let photoId = photoInfo.id;
                // Load  entry HTML template:
                $.get(PHOTO_GALLERY_ENTRY_COMPONENT_PATH, function(photoTemplate) {
                    console.log(imageInfo);
                    console.log(photoId);
                    entryHTML = constructPhotoEntryHTML(photoTemplate, photoInfo, imageInfo);
                    console.log(entryHTML);
                    $.parseHTML(entryHTML).filter("#gallery-modal-"+imageInfo.imageId).modal("toggle");
                });
            }
        });
    });
}

function getPhoto(photoId) {
    // Load photo from config and show as modal (for cases where photo is needed but not yet loaded)
    // Exiting will remove photo
}

function constructPhotoEntryHTML(photoTemplate, photoInfo, imageInfo) {
    truncatedTagsHTML = constructTagsHTML(photoInfo.tags);
    fullTagsHTML = constructTagsHTML(photoInfo.tags, false);
    templateEntries = {
        "imageId": photoInfo.imageId,
        "imagePath": imageInfo.path,
        "orientation": photoInfo.orientation,
        "title": photoInfo.title,
        "caption": photoInfo.caption,
        "settings": photoInfo.settings,
        "description": photoInfo.description,
        "photoGalleryTags": truncatedTagsHTML,
        "photoModalTags": fullTagsHTML
    };
    
    photoEntry = photoTemplate.format(templateEntries);
    return photoEntry;
}