import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addDecimal',
  standalone: true
})
export class AddDecimalPipe implements PipeTransform {

  transform(rating: number): string {
    console.log("ssssssssssssssssssssssssssssssssssssssssssssssssssssssss");
    console.log("New rating:" + `${rating}.0`);
    
    
    return rating % 1 === 0 ? `${rating}.0` : String(rating);
  }

}
