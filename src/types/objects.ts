type BaseObject = {
    x: number;
    y: number;
    width: number;
    height: number;
}

type TextObject = BaseObject & {
    type: 'text';
    id: string;
    text: string;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
}

type ImageObject = BaseObject & {
    type: 'image';
    id: string;
    src: string;
}

type ObjectId = {
    objectId: string
}

type MoveObjectParams = ObjectId & { 
    newX?: number,
    newY?: number
}

type ResizeObjectParams = ObjectId & {
    newWidth?: number, 
    newHeight?: number
}

type UpdateTextObjectStyleParams = ObjectId & {
    newFontFamily?: string, 
    newFontSize?: number, 
    newFontColor?: string
}

type SlideObject = TextObject | ImageObject

type TextObjectInput = Omit<TextObject, 'id' | 'type'>;
type ImageObjectInput = Omit<ImageObject, 'id' | 'type'>;

export type { TextObject, SlideObject, TextObjectInput, ImageObjectInput, MoveObjectParams, ResizeObjectParams, UpdateTextObjectStyleParams }