import {FormatThousandsPipe} from '../../common/utils/format-thousands.pipe';

export class NumberFormatter {
  static suffixes = ['K', 'M'];
  static thousandFormatter = new FormatThousandsPipe();

  public static kFormat(value, useKFormatter): string {
    if (!useKFormatter) {
      return NumberFormatter.thousandFormatter.transform(value);
    }
    let num = parseFloat(value);
    let i = -1;
    while (Math.abs(num) > 999 && i < 1) {
      num = Math.sign(num) * (Math.abs(num) / 1000);
      i++;
    }
    return i > -1 ?
      NumberFormatter.thousandFormatter.transform(num.toFixed(NumberFormatter.getCountDecimalPositions(i))) + NumberFormatter.suffixes[i] : (Math.sign(num) * Math.abs(num)).toString();
  }

  private static getCountDecimalPositions(dividedTimes: number): number {
    if (dividedTimes === 0) {
      return 0;
    }
    return 1;
  }
}
