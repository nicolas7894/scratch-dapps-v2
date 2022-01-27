import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {

  transform(value: string): string {
    return value.substr(0, 4) + '...' + value.substr(value.length-4, 4);
  }

}
