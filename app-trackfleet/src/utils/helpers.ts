export const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'} atrás`;
    }
    return `${diffHours} ${diffHours === 1 ? 'hora' : 'horas'} atrás`;
  } else if (diffDays === 1) {
    return 'yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const formatNumber = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function formatTime(dateInput: string | Date) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function maskPhone(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

export function maskCep(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .slice(0, 9);
}

export function isValidCNH(cnh: string): boolean {
  cnh = cnh.replace(/\D/g, '');

  if (!/^\d{11}$/.test(cnh)) return false;
  if (/^(\d)\1+$/.test(cnh)) return false;

  let dsc = 0;
  let v = 0;

  for (let i = 0, j = 9; i < 9; ++i, --j) {
    v += parseInt(cnh.charAt(i)) * j;
  }
  let dv1 = v % 11;
  if (dv1 >= 10) {
    dv1 = 0;
    dsc = 2;
  }

  v = 0;
  for (let i = 0, j = 1; i < 9; ++i, ++j) {
    v += parseInt(cnh.charAt(i)) * j;
  }
  let dv2 = v % 11;
  if (dv2 >= 10) dv2 = 0;

  return cnh.substr(9, 2) === `${dv1}${dv2}`;
}

export function maskCNH(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11);
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return /^(\d{10,11})$/.test(cleaned);
}