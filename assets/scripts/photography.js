PHOTO_GALLERY_ENTRY_COMPONENT_PATH = "./assets/html/components/photo_gallery_entry.html"
NUM_COLS = 3


$().ready(function() {
   /**
    * Begin with desired content as default
    */
    // Load photo entry HTML template:
    $.get(PHOTO_GALLERY_ENTRY_COMPONENT_PATH, function(photoTemplate) {
        // Load config data
        $.getJSON("/config.json", function(data) {
            // Sort objects by date
            let sortedPhotoInfo = data.photography.photos.sort(getObjectComparator('date'));
            let numCols = NUM_COLS
            let numPhotos = sortedPhotoInfo.length;
            let prevRow = null;

            sortedPhotoInfo.forEach((photoInfo, idx) => {
                console.log(idx + " " + photoInfo)
                let colIdx = idx % NUM_COLS;
                imageInfo = data.data.images[photoInfo.imageId];
                entryHTML = constructPhotoEntryHTML(photoTemplate, photoInfo, imageInfo);
                $("#photo-gallery #gallery-col-${colIdx}").append(entryHTML);
                
            });
        });
    });

});

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