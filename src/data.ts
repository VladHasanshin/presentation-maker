import type { Presentation } from './types/presentation.js';
import { createPresentation } from './functions/presentation.js';
import { addSlide, setSlideBackgroundColor } from './functions/slide.js';
import { addTextObject} from './functions/objects.js';

/**
 * Создаёт тестовую презентацию с несколькими слайдами и объектами.
 * Используется для начальной загрузки приложения.
 */
function createTestPresentation(): Presentation {
  let presentation = createPresentation('Тестовая презентация');

  // Первый слайд -- заголовок
  let slide1 = presentation.slides[0];
  slide1 = setSlideBackgroundColor(slide1, '#f0f0f0');
  slide1 = addTextObject(slide1, {text: 'Добро пожаловать!', x: 50, y: 50, width: 400, height: 60, fontFamily: 'Arial', fontSize: 32, fontColor: '#333333'});
  slide1 = addTextObject(slide1, {text: 'Лабораторная работа #2', x: 50, y: 120, width: 400, height: 40, fontFamily: 'Arial', fontSize: 20, fontColor: '#666666'});
  
  // Второй слайд
  presentation = addSlide(presentation, 'Список');
  let slide2 = presentation.slides[1];
  slide2 = setSlideBackgroundColor(slide2, '#ffffff');
  slide2 = addTextObject(slide2, {text: 'Список задач:', x: 50, y: 50, width: 300, height: 40, fontFamily: 'Arial', fontSize: 24, fontColor: '#000000'});
  slide2 = addTextObject(slide2, {text: '1. Разработать интерфейс', x: 50, y: 100, width: 300, height: 30, fontFamily: 'Arial', fontSize: 18, fontColor: '#333333'});
  slide2 = addTextObject(slide2, {text: '2. Добавить интерактивность', x: 50, y: 140, width: 300, height: 30, fontFamily: 'Arial', fontSize: 18, fontColor: '#333333'});
  slide2 = addTextObject(slide2, {text: '3. Выделить общие компоненты', x: 50, y: 180, width: 300, height: 30, fontFamily: 'Arial', fontSize: 18, fontColor: '#333333'});

  // Третий слайд
  presentation = addSlide(presentation, 'Итоги');
  let slide3 = presentation.slides[2];
  slide3 = setSlideBackgroundColor(slide3, '#e8f5e9');
  slide3 = addTextObject(slide3, {text: 'Итоги работы:', x: 50, y: 50, width: 300, height: 40, fontFamily: 'Arial', fontSize: 24, fontColor: '#2e7d32'});
  slide3 = addTextObject(slide3, {text: 'Готово!', x: 50, y: 120, width: 200, height: 60, fontFamily: 'Arial', fontSize: 36, fontColor: '#4caf50'});

  presentation = {
    ...presentation,
    slides: [slide1, slide2, slide3]
  };

  return presentation;
}

export {
  createTestPresentation
}