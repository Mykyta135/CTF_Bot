import z from 'zod';

export const TeamNameSchema = z.string().regex(/^[a-zA-Zа-яА-Я0-9_-ґҐєЄіІїЇ]+$/, 'Назва команди повинна містити лише літери (українська латинь), цифри, підкреслення та дефіс');
export const TeamIdSchema = z.string().length(24, 'ID команди повинен містити 24 символа');