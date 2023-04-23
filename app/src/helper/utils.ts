import { createContext } from 'react';
import { IRowMovieContextType } from './interfaces';

export const truncate = (descriptionString: string, len: number) => {
  return descriptionString?.length > len ? descriptionString.substring(0, len - 1) + '...' : descriptionString;
};

export const ClickedMovieContext = createContext<IRowMovieContextType>({
  clickedMovie: null,
  rowIndex: 0,
  setClickedMovie: () => {},
  setRowIndex: () => {},
});
