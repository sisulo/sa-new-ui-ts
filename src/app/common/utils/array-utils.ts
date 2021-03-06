export class ArrayUtils {
  public static min(data) {
    return data.reduce((previousValue, currentValue) => previousValue < currentValue ? previousValue : currentValue);
  }

  public static max(data) {
    return data.reduce((previousValue, currentValue) => previousValue > currentValue ? previousValue : currentValue);
  }
}
