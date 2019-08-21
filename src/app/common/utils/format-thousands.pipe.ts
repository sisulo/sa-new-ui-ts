import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'formatThousands'
  })
  export class FormatThousandsPipe implements PipeTransform {
    private static THOUSANDS_DELIMITER = ' ';
    private static LENGTH_OF_THOUSANDS = 3;

    transform(value: string, args?: any): any {
      if (!parseFloat(value)) {
        return value;
      }
      let currentValue = value.toString();
      let result = '';
      let decimalPart = '';
      const matchOccurenceIndex = currentValue.lastIndexOf('.');
      if (matchOccurenceIndex !== -1) {
        decimalPart = currentValue.substring(matchOccurenceIndex, currentValue.length);
        currentValue = currentValue.substring(0, matchOccurenceIndex);
      }
      while (currentValue.length > FormatThousandsPipe.LENGTH_OF_THOUSANDS) {
        if (result === '') {
          result = currentValue.substr(-FormatThousandsPipe.LENGTH_OF_THOUSANDS, FormatThousandsPipe.LENGTH_OF_THOUSANDS);
        } else {
          result =  currentValue.substr(-FormatThousandsPipe.LENGTH_OF_THOUSANDS, FormatThousandsPipe.LENGTH_OF_THOUSANDS) + FormatThousandsPipe.THOUSANDS_DELIMITER + result;
        }
        currentValue = currentValue.substr(0, currentValue.length - FormatThousandsPipe.LENGTH_OF_THOUSANDS);
      }
      result = currentValue + (result === '' ? '' : FormatThousandsPipe.THOUSANDS_DELIMITER) + result + decimalPart;
      return result;
    }

  }
