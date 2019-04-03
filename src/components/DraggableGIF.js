import React from 'react';
import { DragSource } from 'react-dnd';
import GIF from './GIF';
import { namespace } from '../lib/constants';

const DndTypes = {
    RESULT: 'result',
};

const Result = props => props.connectDragSource(
    <span>
      <GIF 
        key={props.id}
        id={props.id}
        // "Width set to 200px. Reduced to 6 frames. Works well for unlimited scroll on mobile and as animated previews."
        url={props.paused ? props.images.fixed_width_still.url : props.images.fixed_width_downsampled.url}
        HDurl={props.images.original.url}
        alt={props.title}
        title={props.title}
        username={props.username}
        rating={props.rating}
        uploadDate={props.import_datetime}
        collectionId={props.collectionId}
        addToCollection={props.addToCollection}
        removeFromCollection={props.removeFromCollection}
        randomize={props.randomize}
      />
    </span>
);
  
export const DraggableGIF = DragSource(
  DndTypes.RESULT,
  {
    beginDrag(props, monitor, component) {
      const item = props;
      return item;
    },
    endDrag(props, monitor, component) {
      // if item is not dropped into target zone
      // check to see if item is in targetzone
      // if it is, remove it from localStorage (collection, collectionID state)
      if (!monitor.didDrop() && localStorage.getItem(`${namespace}${props.id}`)) {
          props.removeFromCollection(props.id)
      }
      return;
    }
  },
  function registerWithDnD(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    };
  },
)(Result);