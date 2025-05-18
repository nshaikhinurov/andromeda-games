/** @jsxImportSource @emotion/react */

import { palette } from 'src/consts/palette';
import { sizes } from 'src/consts/sizes';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button css={buttonStyles} type="button" onClick={onClick}>
      {children}
    </button>
  );
};

const buttonStyles = {
  minWidth: 2 * sizes.cardWidth + sizes.gap,
  fontFamily: 'inherit',
  fontSize: '0.5rem',
  textTransform: 'uppercase',
  color: palette.black,
  border: 'none',
  borderRadius: '0.2em',
  backgroundColor: '#e6e6e6',
  padding: '0.5em 1em',
  cursor: 'pointer',
  boxShadow: '0 6px 6px rgba(0, 0, 0, 0.23)',
  transition: 'all 0.2s ease',

  '&:hover': {
    backgroundColor: '#fff',
    letterSpacing: '0.025em',
    boxShadow: '0 6px 6px rgba(0, 0, 0, 0.23), 0 10px 20px rgba(0, 0, 0, 0.19)',
  },
} as const;
