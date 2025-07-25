export class KeyboardManager {
  public static isEnterKey<T>(event: KeyboardEvent | React.KeyboardEvent<T>) {
    return event.key === 'Enter';
  }

  public static isEscKey<T>(event: KeyboardEvent | React.KeyboardEvent<T>) {
    return event.key === 'Escape';
  }

  public static isArrowKey<T>(event: KeyboardEvent | React.KeyboardEvent<T>) {
    return (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight'
    );
  }

  public static isArrowUpKey<T>(event: KeyboardEvent | React.KeyboardEvent<T>) {
    return event.key === 'ArrowUp';
  }

  public static isArrowDownKey<T>(
    event: KeyboardEvent | React.KeyboardEvent<T>
  ) {
    return event.key === 'ArrowDown';
  }

  public static isArrowLeftKey<T>(
    event: KeyboardEvent | React.KeyboardEvent<T>
  ) {
    return event.key === 'ArrowLeft';
  }

  public static isArrowRightKey<T>(
    event: KeyboardEvent | React.KeyboardEvent<T>
  ) {
    return event.key === 'ArrowRight';
  }

  public static isNumberKey<T>(event: KeyboardEvent | React.KeyboardEvent<T>) {
    return (
      (event.key.length === 1 && event.key >= '0' && event.key <= '9') ||
      (event.code.startsWith('Numpad') && event.key >= '0' && event.key <= '9')
    );
  }

  public static isKey<T>(
    event: KeyboardEvent | React.KeyboardEvent<T>,
    key: string
  ) {
    return event.key === key;
  }
}
