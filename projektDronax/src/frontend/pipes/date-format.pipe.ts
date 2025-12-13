import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0'); // Dodaje 0 ako je manji od 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mjeseci idu od 0-11
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
}
