PHOTO_GALLERY_ENTRY_COMPONENT_PATH = "./assets/html/components/photo_gallery_entry.html"

$().ready(function() {
   /**
    * Begin with desired content as default
    */
    console.log("Photography page loaded!");
    // Load config data
    $.getJSON("/config.json", function(data) {
        console.log(data.photography);
        // Sort objects by date
        let sortedPhotoInfo = data.photography.photos.sort(getObjectComparator('date'));
        console.log(sortedPhotoInfo);
        sortedPhotoInfo.forEach((photoInfo) => {
            imageInfo = data.data.images[photoInfo.imageId];
            console.log(imageInfo)
            entryHTML = constructPhotoEntryHTML(photoInfo, imageInfo);
            $("div.gallery.photo-gallery").html(entryHTML);
        });
    });

});

function constructPhotoEntryHTML(photoInfo, imageInfo) {
    truncatedTagsHTML = constructTagsHTML(photoInfo.tags);
    fullTagsHTML = constructTagsHTML(photoInfo.tags, false);
    templateEntries = {
        "image-id": photoInfo.imageId,
        "image-path": imageInfo.path,
        "orientation": photoInfo.orientation,
        "title": photoInfo.title,
        "caption": photoInfo.caption,
        "description": photoInfo.description,
        "photo-gallery-tags-html": truncatedTagsHTML,
        "photo-modal-tags-html": fullTagsHTML
    };
    // Load HTML template
    var photoEntry = null;
    $.get(PHOTO_GALLERY_ENTRY_COMPONENT_PATH, function(photoTemplate) {
        photoEntry = photoTemplate.format(templateEntries);
    });
    console.log(photoEntry);
    return photoEntry;
}