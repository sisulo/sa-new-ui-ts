export class NumberFormatter {
  static suffixes = ['K', 'M'];

  public static kFormat(value, useKFormatter) {
    if (!useKFormatter) {
      return value;
    }
    let num = parseFloat(value);
    let i = -1;
    while (Math.abs(num) > 999 && i < 1) {
      num = Math.sign(num) * (Math.abs(num) / 1000);
      i++;
    }
    return i > -1 ? num.toFixed(1) + NumberFormatter.suffixes[i] : Math.sign(num) * Math.abs(num);
  }
}
