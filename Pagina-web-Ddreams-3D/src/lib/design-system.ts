import { colors } from '@/shared/styles/colors';
import { Button } from '@/components/ui/button';

/**
 * Design System - Single Source of Truth
 * 
 * Este archivo consolida los tokens de diseño y componentes base
 * para facilitar su uso y mantenimiento.
 */

export const DesignSystem = {
  tokens: {
    colors,
  },
  components: {
    Button,
  }
};

export { colors as designTokens };
export { Button };
