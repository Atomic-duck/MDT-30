import { Callout, PointAnnotation } from "@rnmapbox/maps";
import { Position } from "@rnmapbox/maps/lib/typescript/types/Position";
import { useRef } from "react";
import { Image, StyleSheet, View } from "react-native";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot'
import pinImg from "../../images/pin.png"

type AnnotationWithImageProps = {
   id: string;
   title: string;
   coordinate: Position;
   onDragEnd: ((payload: any) => void);
};

const ANNOTATION_SIZE = 40;

const AnnotationWithImage = ({
   id,
   coordinate,
   title,
   onDragEnd
}: AnnotationWithImageProps) => {
   const pointAnnotation = useRef<PointAnnotation>(null);

   return (
      <PointAnnotation
         id={id}
         coordinate={coordinate}
         title={title}
         draggable
         onDragEnd={onDragEnd}
         ref={pointAnnotation}
      >
         <View style={styles.annotationContainer}>
            {/* <FontAwesomeIcon icon={faLocationDot} size={32} color='green' /> */}
            <Image
               source={pinImg}
               style={{ width: ANNOTATION_SIZE, height: ANNOTATION_SIZE }}
               onLoad={() => {
                  pointAnnotation.current?.refresh()
               }}
               // Prevent rendering bitmap at unknown animation state
               fadeDuration={0}
            />
         </View>
         <Callout title={title} />
      </PointAnnotation>
   );
};

export default AnnotationWithImage;

const styles = StyleSheet.create({
   annotationContainer: {
      alignItems: 'center',
      backgroundColor: 'white',
      borderColor: 'rgba(0, 0, 0, 0.45)',
      borderRadius: ANNOTATION_SIZE / 2,
      borderWidth: StyleSheet.hairlineWidth,
      height: ANNOTATION_SIZE,
      justifyContent: 'center',
      overflow: 'hidden',
      width: ANNOTATION_SIZE,
   }
});