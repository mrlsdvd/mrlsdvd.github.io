PHOTO_GALLERY_ENTRY_COMPONENT_PATH = "./assets/html/components/photo_gallery_entry.html"

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
            let numCols = data.photography.numCols;
            let numPhotos = sortedPhotoInfo.length;
            let prevRow = null;

            sortedPhotoInfo.forEach((photoInfo, idx) => {
                console.log(idx + " " + photoInfo)
                if (idx % (numCols+1) == 0) {
                    if (prevRow != null) {
                        prevRow += "</div>";
                        $("#photo-gallery").append(prevRow);

                    }
                    prevRow = `<div class="row">`;

                }
                imageInfo = data.data.images[photoInfo.imageId];
                entryHTML = constructPhotoEntryHTML(photoTemplate, photoInfo, imageInfo);
                prevRow += entryHTML;
                if (idx == numPhotos - 1) {
                    prevRow += "</div>";
                    $("#photo-gallery").append(prevRow);
                }
                
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