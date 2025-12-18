import type { FieldItem } from "~/types/data.types";

export const useCommon = () => {

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const dateToString = (timestamp: number, withTime: boolean) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const finalDate = `${year}-${month}-${day}`;
    
    if(!withTime) return finalDate;

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${finalDate}T${hours}:${minutes}:${seconds}`;
  };

  const showPassword = (fields: FieldItem[], name: string) => {
    const password = fields.find(item => item.name === name);
    if (!password) return;
    password.type = password?.type === 'password' ? 'text' : 'password';
  };

  return {
    formatTime,
    dateToString,
    showPassword
  }
}
