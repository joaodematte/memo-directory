export class ShortcutManager {
  public static isFocusInputShortcut<T>(
    event: KeyboardEvent | React.KeyboardEvent<T>
  ) {
    return (event.metaKey || event.altKey) && event.key === 'k';
  }

  public static isFocusFirstItemShortcut<T>(
    event: KeyboardEvent | React.KeyboardEvent<T>
  ) {
    return (event.metaKey || event.altKey) && event.key === 'f';
  }

  public static isOpenInNewTabShortcut<T>(
    event: KeyboardEvent | React.KeyboardEvent<T>
  ) {
    return (event.metaKey || event.altKey) && event.key === 'Enter';
  }

  public static isEditShortcut<T>(
    event: KeyboardEvent | React.KeyboardEvent<T>
  ) {
    return (event.metaKey || event.altKey) && event.key === 'e';
  }

  public static isDeleteShortcut<T>(
    event: KeyboardEvent | React.KeyboardEvent<T>
  ) {
    return (event.metaKey || event.altKey) && event.key === 'd';
  }

  public static isCopyShortcut<T>(
    event: KeyboardEvent | React.KeyboardEvent<T>
  ) {
    return (
      (event.metaKey || event.altKey || event.ctrlKey) && event.key === 'c'
    );
  }

  public static isPasteShortcut<T>(
    event: KeyboardEvent | React.KeyboardEvent<T>
  ) {
    return (event.metaKey || event.ctrlKey) && event.key === 'v';
  }
}
