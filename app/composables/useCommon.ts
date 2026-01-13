import type { FieldItem } from "~/types/data.types";

export const useCommon = () => {

  const throttle = <T extends (...args: any[]) => any>(fn: T, delay: number = 1000) => {
    let timer: ReturnType<typeof setTimeout> | null;

    return (...args: Parameters<T>) => {
      if (timer) return;

      fn(...args);

      timer = setTimeout(() => {timer = null}, delay);
    }
  };

  const formatTime = (seconds: number | undefined | null): string => {

    if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) return "00:00";

    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);

    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const dateToString = (val: number | string | Date, withTime: boolean = false) => {
    const date = new Date(val);

    if (isNaN(date.getTime())) return '';

    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const datePart = `${year}-${month}-${day}`;
    
    if(!withTime) return datePart;

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${datePart}T${hours}:${minutes}:${seconds}`;
  };

  const showPassword = (fields: FieldItem[], name: string) => {
    const field = fields.find(item => item.name === name);
    if (field && (field.type === 'password' || field.type === 'text')) {
      field.type = field?.type === 'password' ? 'text' : 'password';
    }
  };

  return {
    formatTime,
    dateToString,
    showPassword,
    throttle
  }
}
