import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addDecimal',
  standalone: true
})
export class AddDecimalPipe implements PipeTransform {

  transform(rating: number): string {
    return rating % 1 === 0 ? `${rating}.0` : String(rating);
  }

}
