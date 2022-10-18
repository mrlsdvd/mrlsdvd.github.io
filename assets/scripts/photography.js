PHOTO_GALLERY_ENTRY_COMPONENT_PATH = "./assets/html/components/photo_gallery_entry.html"

$().ready(function() {
   /**
    * Begin with desired content as default
    */
    console.log("Photography page loaded!");
    // Load photo entry HTML template:
    $.get(PHOTO_GALLERY_ENTRY_COMPONENT_PATH, function(photoTemplate) {
        // Load config data
        $.getJSON("/config.json", function(data) {
            console.log(data.photography);
            // Sort objects by date
            let sortedPhotoInfo = data.photography.photos.sort(getObjectComparator('date'));
            console.log(sortedPhotoInfo);
            sortedPhotoInfo.forEach((photoInfo) => {
                imageInfo = data.data.images[photoInfo.imageId];
                console.log(imageInfo)
                entryHTML = constructPhotoEntryHTML(photoTemplate, photoInfo, imageInfo);
                console.log(entryHTML);
                $("#photo-gallery").append(entryHTML);
            });
        });
    });

});

function constructPhotoEntryHTML(photoTemplate, photoInfo, imageInfo) {
    console.log(photoInfo)
    console.log(photoInfo.tags)
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
    console.log(photoEntry);
    return photoEntry;
}