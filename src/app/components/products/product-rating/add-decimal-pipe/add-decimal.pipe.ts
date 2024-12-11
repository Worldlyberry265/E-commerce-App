import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addDecimal',
  standalone: true
})
export class AddDecimalPipe implements PipeTransform {

  // This pipe will make all ratings have the same decimal format.
  // For example, 1 will be displayed as 1.0 to be like the other ratings such as 3.2
  transform(rating: number): string {
    return rating % 1 === 0 ? `${rating}.0` : String(rating);
  }

}
