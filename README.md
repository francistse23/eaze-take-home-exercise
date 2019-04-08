# Take-home exercise for frontend interviews at Eaze

## Intro

Please read the following on the functions I have implemented in this project. Comments are added as explanation/clarification in each component.

## App.js
- Most states of the children components are in here.
- From top to bottom, you will see:
    - AppHeader(fixed): The Eaze logo and View Collection button.
        - The AppHeader will hide/show on scroll to maximize the focus on the product (GIFs).
    - While the GIFs are still being loaded, a spinning Eaze logo will show in place of the results.
    - There are currently 2 routes: '/' and '/collection'.
        - '/' handles the all the GIF viewing, storing (include the drag and drop function).
        - '/collection' will allow user to view and manage their collection (Remove from collection by dragging out of the boxed area or clicking the button in the modal)
    
## Home.js
- This serves as the parent component to the majority of the components.
- From left to right, top to bottom, we have:
    - Search
        - Play/pause animation button, search bar, and the toggle buttons for NSFW and GIF/Sticker
            - This customizes the search and random functions
        -  Surprise Me
            - Button that uses GIPHY's random endpoint to generate a random GIF/Sticker. The randomizer can be further controlled using the NSFW toggling (to show GIFs that are not rated G), type (GIFs/Stickers), and tags (input into the search bar, separated by space)
        - A Clear Collection button will appear if there is at least 1 GIF/Sticker in the collection
    - PageHeader
        - If search input is empty, it's defaulted to show Trending results. It'll also show the total number of GIFs/Stickers in that category/search parameter. Further, it will show how many GIFs/Stickers are omitted if the NSFW toggle is off.
        - A button to sort the GIF/Sticker result by uploading date (both descending and ascending). 
    - PageContent: renders the results and Dropzone
    - Footer (fixed): shows the page number, and previous/next buttons to navigate results (GIPHY's public beta key does not allow returning results > 25. The previous/next button just sets the offset so it seems like it's "turning the page." I further tested this with my own GIPHY API key.)

## DraggableGIF.js
- This component makes each GIF/Sticker draggable.
- Dragging a GIF/Sticker into the TargetDropzone will store it into your collection
- In contrast, dragging a GIF/Sticker out of the TargetDropzone will remove it from your collection

## GIF.js
- This renders each GIF/sticker
- As a preview, each GIF/sticker is rendered using its fixed width downsampled URL. This will allow faster loading since the file size is much smaller.
    - WebP was considered, but given the limited number of browsers that supports the WebP format, regular URLs are used instead
- GIFs/Stickers that are not rated G will have a red border around it
- OnClick, a modal will be brought up and it'll render the GIF/sticker's title, the GIF/Sticker in its original size and frame rate. It will show the following information as well:
    - The rating of the GIF/sticker (G, PG, R, etc.)
    - Whom the GIF/sticker is uploaded by (if there's an associated username)
    - The date the GIF/sticker is upload on.
- The modal also includes two buttons: Add to Collection/Remove from Collection and Surprise Me.
    - As the name suggests, Add to/Remove from Collection will add/remove the selected GIF/Sticker to your collection.
    - Surprise Me utilizes the random endpoint from GIPHY's API and generates a random GIF/sticker and show it in a modal.

## GIFCollection.js
- This renders an area on the page and show what GIFs/Stickers are in your collection
    This will not show on mobile to allow user to focus on the product (User can still add/remove something from their collection utilizing the buttons in the modal)
- User can utilize DnD or the add/remove buttons to manage his/her collection
- Minor issue, whatever being dragged and dropped are being stored in order. However, the render might shuffle the collection a little bit.
    - Further testing shows DnD just orders the DragSource by where it was dropped in the DropZone.

## SearchBar.js
- This takes care of the searching function using GIPHY's API
- Added a button to play/pause GIF/Sticker for results
- The input is debounced to limit the number of API calls make to GIPHY. Currently wait time is set to 500ms
- The input field also acts as tags for randomizer.
- In addition to the search bar, there are two toggle buttons: NSFW and type.
    - If the NSFW (Not Safe For Work) button is not toggled, only rated G GIFs/Stickers will be returned. In addition, it will show how many of the results are omitted because of the filter.
    - The type button is used to toggle search/randomize GIFs or Stickers