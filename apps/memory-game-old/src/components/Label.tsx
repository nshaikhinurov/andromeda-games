/** @jsxImportSource @emotion/react */

import React from 'react';
import cx from 'classnames';
import { palette } from 'src/consts/palette';
import { sizes } from 'src/consts/sizes';
import { Card } from 'src/models/Card';

import club from 'src/assets/suits/club.svg';
import diamond from 'src/assets/suits/diamond.svg';
import heart from 'src/assets/suits/heart.svg';
import spade from 'src/assets/suits/spade.svg';

interface LabelProps {
  card: Card;
}

const Label: React.FC<LabelProps> = ({ card }) => {
  // FYI: digits are displayed smaller in Verlag font by default, so we'll fix it
  const isNumeric = !Number.isNaN(Number(card.rank));

  return (
    <div css={labelStyles}>
      <div className={cx('suit', card.suit)} />
      <div className={cx('rank', card.color, { isNumeric })}>{card.rank}</div>
      <div className={cx('suit', 'inverted', card.suit)} />
    </div>
  );
};

const fz = `${0.15 * sizes.cardWidth}px`;
const labelStyles = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: fz,
  padding: '0.75em',

  '.suit': {
    alignSelf: 'flex-start',
    '&.inverted': {
      alignSelf: 'flex-end',
    },

    width: '1em',
    height: '1em',

    '&.heart': {
      background: `url(${heart}) top center no-repeat`,
    },
    '&.club': {
      background: `url(${club}) top center no-repeat`,
    },
    '&.diamond': {
      background: `url(${diamond}) top center no-repeat`,
    },
    '&.spade': {
      background: `url(${spade}) top center no-repeat`,
    },
  },

  '.rank': {
    fontSize: `calc(1.5 * ${fz})`,
    '&.isNumeric': { fontSize: `calc(1.21 * 1.5 * ${fz})` },
    lineHeight: '0.72em',
    marginBottom: 0.066 * sizes.cardWidth,
    '&.red': { color: palette.red },
    '&.black': { color: palette.black },
  },
};

export default Label;
