import { AuthRoutesEnum } from '@libs/core-shared';

export const isAuthPath = (url: string): boolean => {
  const urlFragments = url.split('/');
  return [AuthRoutesEnum.AUTH].some((fragment) =>
    urlFragments.includes(fragment),
  );
};
