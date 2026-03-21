import { nanoid } from 'nanoid';

const MAX_LEN = 48;

export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_LEN);
}

export async function uniqueSlug(base, existsFn) {
  let slug = slugify(base) || 'tienda';
  if (!(await existsFn(slug))) return slug;
  for (let i = 0; i < 10; i += 1) {
    const candidate = `${slug}-${nanoid(6).toLowerCase()}`;
    if (!(await existsFn(candidate))) return candidate;
  }
  return `${slug}-${nanoid(10).toLowerCase()}`;
}
