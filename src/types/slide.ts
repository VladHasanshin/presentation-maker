import type { SlideObject } from "./objects.js";

type ImageBackground = {
    type: 'image';
    src: string;
}

type ColorBackground = {
    type: 'color';
    color: string;
}

type GradientBackground = {
    type: 'gradient';
    colors: string[];
    angle?: number;
    gradientType?: 'linear' | 'radial';
}

type GradientParams = Omit<GradientBackground, 'type'>;

type Background = ImageBackground | ColorBackground | GradientBackground | undefined

type Slide = {
    id: string;
    name: string;
    slideObjects: SlideObject[];
    background: Background;
}

export type { Slide, Background, GradientParams };