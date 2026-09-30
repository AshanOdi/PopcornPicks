import { IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface ScrollArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  /** Vertical position within the row */
  top?: string;
}

/**
 * ‹ › button on the edge of a horizontal row (desktop only).
 * Hidden until the parent is hovered: the parent needs `'&:hover .row-arrow': { opacity: 1 }`.
 */
function ScrollArrow({ direction, onClick, top = '40%' }: ScrollArrowProps) {
  return (
    <IconButton
      onClick={onClick}
      aria-label={`scroll ${direction}`}
      className="row-arrow"
      sx={{
        position: 'absolute',
        top,
        [direction]: -8,
        transform: 'translateY(-50%)',
        zIndex: 1,
        display: { xs: 'none', md: 'flex' },
        opacity: 0, // revealed when the row is hovered
        transition: 'opacity 0.2s',
        bgcolor: 'background.paper',
        boxShadow: 3,
        '&:hover': { bgcolor: 'background.paper' },
      }}
    >
      {direction === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </IconButton>
  );
}

export default ScrollArrow;
