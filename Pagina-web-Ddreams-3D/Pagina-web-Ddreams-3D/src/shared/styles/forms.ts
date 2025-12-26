/**
 * Configuración centralizada de formularios para Ddreams 3D
 * Este archivo define todos los estilos de formularios para mantener consistencia
 */

export const forms = {
  // Estilos base para inputs
  input: {
    // Tamaños de inputs
    size: {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg'
    },
    
    // Estilos base
    base: 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    
    // Estados del input
    state: {
      default: 'border-neutral-300 bg-white text-neutral-900 placeholder-neutral-500 focus:border-primary-500 focus:ring-primary-500',
      error: 'border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500 focus:ring-red-500',
      success: 'border-green-300 bg-green-50 text-green-900 placeholder-green-400 focus:border-green-500 focus:ring-green-500',
      disabled: 'border-neutral-200 bg-neutral-100 text-neutral-500 placeholder-neutral-400 cursor-not-allowed'
    },
    
    // Variantes de estilo
    variant: {
      outlined: 'border-2',
      filled: 'border-0 bg-neutral-100 focus:bg-white focus:ring-2',
      underlined: 'border-0 border-b-2 rounded-none bg-transparent focus:ring-0 focus:border-primary-500'
    }
  },
  
  // Estilos para labels
  label: {
    // Tamaños
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    },
    
    // Estilos base
    base: 'block font-medium mb-2',
    
    // Estados
    state: {
      default: 'text-neutral-700',
      error: 'text-red-700',
      success: 'text-green-700',
      disabled: 'text-neutral-500'
    },
    
    // Variantes
    variant: {
      floating: 'absolute left-4 top-3 transition-all duration-200 pointer-events-none',
      inline: 'inline-block mr-3',
      required: 'after:content-["*"] after:text-red-500 after:ml-1'
    }
  },
  
  // Estilos para textareas
  textarea: {
    base: 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 resize-vertical',
    size: {
      sm: 'px-3 py-2 text-sm min-h-[80px]',
      md: 'px-4 py-3 text-base min-h-[100px]',
      lg: 'px-5 py-4 text-lg min-h-[120px]'
    }
  },
  
  // Estilos para selects
  select: {
    base: 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white appearance-none',
    icon: 'absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none w-5 h-5 text-neutral-400'
  },
  
  // Estilos para checkboxes y radios
  checkbox: {
    base: 'w-4 h-4 rounded border-2 border-neutral-300 text-primary-600 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2',
    label: 'ml-3 text-neutral-700 cursor-pointer select-none'
  },
  
  radio: {
    base: 'w-4 h-4 border-2 border-neutral-300 text-primary-600 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2',
    label: 'ml-3 text-neutral-700 cursor-pointer select-none'
  },
  
  // Estilos para grupos de campos
  fieldGroup: {
    base: 'space-y-4',
    inline: 'flex flex-wrap gap-4',
    grid: 'grid gap-4',
    
    // Layouts responsivos
    responsive: {
      twoColumns: 'grid grid-cols-1 md:grid-cols-2 gap-4',
      threeColumns: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
      autoFit: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    }
  },
  
  // Mensajes de validación
  validation: {
    message: {
      base: 'mt-2 text-sm flex items-center',
      error: 'text-red-600',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600'
    },
    
    icon: {
      error: 'w-4 h-4 mr-2 text-red-500',
      success: 'w-4 h-4 mr-2 text-green-500',
      warning: 'w-4 h-4 mr-2 text-yellow-500',
      info: 'w-4 h-4 mr-2 text-blue-500'
    }
  },
  
  // Estilos para botones de formulario
  button: {
    // Botón principal de envío
    submit: {
      base: 'w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg transition-all duration-300 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
      },
      state: {
        loading: 'opacity-75 cursor-not-allowed',
        disabled: 'opacity-50 cursor-not-allowed'
      }
    },
    
    // Botón secundario
    secondary: {
      base: 'w-full border-2 border-neutral-300 text-neutral-700 font-semibold rounded-lg transition-all duration-300 hover:border-primary-500 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
      }
    },
    
    // Botón de reset/cancelar
    reset: {
      base: 'w-full bg-neutral-200 text-neutral-700 font-semibold rounded-lg transition-all duration-300 hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2',
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
      }
    }
  },
  
  // Contenedores de formulario
  container: {
    // Formulario básico
    base: 'space-y-6',
    
    // Formulario con card
    card: 'bg-white rounded-xl shadow-lg p-6 space-y-6',
    
    // Formulario modal
    modal: 'bg-white rounded-lg p-6 space-y-6 max-w-md mx-auto',
    
    // Formulario inline
    inline: 'flex flex-wrap items-end gap-4',
    
    // Formulario de contacto
    contact: 'bg-white rounded-xl shadow-xl p-8 space-y-6 max-w-2xl mx-auto'
  },
  
  // Estilos para elementos específicos
  special: {
    // Input de búsqueda
    search: {
      container: 'relative',
      input: 'pl-10 pr-4 py-3 w-full rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      icon: 'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400'
    },
    
    // Input de archivo
    file: {
      container: 'relative',
      input: 'absolute inset-0 w-full h-full opacity-0 cursor-pointer',
      label: 'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors duration-300',
      text: 'text-neutral-600 text-center',
      icon: 'w-8 h-8 text-neutral-400 mb-2'
    },
    
    // Input de rango
    range: {
      input: 'w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider',
      thumb: 'appearance-none w-4 h-4 bg-primary-600 rounded-full cursor-pointer',
      track: 'w-full h-2 bg-neutral-200 rounded-lg'
    },
    
    // Toggle switch
    toggle: {
      container: 'relative inline-block w-12 h-6',
      input: 'opacity-0 w-0 h-0',
      slider: 'absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-neutral-300 rounded-full transition-all duration-300',
      sliderActive: 'bg-primary-600',
      thumb: 'absolute content-[""] h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-all duration-300',
      thumbActive: 'transform translate-x-6'
    }
  }
} as const;

// Funciones helper para generar clases de formulario
export const getInputClasses = (
  size: keyof typeof forms.input.size = 'md',
  state: keyof typeof forms.input.state = 'default',
  variant: keyof typeof forms.input.variant = 'outlined'
) => {
  return `${forms.input.base} ${forms.input.size[size]} ${forms.input.state[state]} ${forms.input.variant[variant]}`;
};

export const getLabelClasses = (
  size: keyof typeof forms.label.size = 'md',
  state: keyof typeof forms.label.state = 'default',
  variant?: keyof typeof forms.label.variant
) => {
  const classes: string[] = [forms.label.base, forms.label.size[size], forms.label.state[state]];
  if (variant && variant in forms.label.variant) {
    classes.push(forms.label.variant[variant]);
  }
  return classes.join(' ');
};

export const getTextareaClasses = (
  size: keyof typeof forms.textarea.size = 'md',
  state: keyof typeof forms.input.state = 'default'
) => {
  return `${forms.textarea.base} ${forms.textarea.size[size]} ${forms.input.state[state]}`;
};

export const getValidationClasses = (
  type: keyof typeof forms.validation.message = 'error'
) => {
  return `${forms.validation.message.base} ${forms.validation.message[type]}`;
};

export const getFormButtonClasses = (
  type: keyof typeof forms.button = 'submit',
  size: 'sm' | 'md' | 'lg' = 'md'
) => {
  const buttonConfig = forms.button[type];
  return `${buttonConfig.base} ${buttonConfig.size[size]}`;
};

// Clases de utilidad comunes
export const commonFormClasses = {
  // Inputs más usados
  input: getInputClasses(),
  inputError: getInputClasses('md', 'error'),
  inputSuccess: getInputClasses('md', 'success'),
  
  // Labels más usados
  label: getLabelClasses(),
  labelRequired: getLabelClasses('md', 'default', 'required'),
  
  // Textareas
  textarea: getTextareaClasses(),
  
  // Botones
  submitButton: getFormButtonClasses('submit'),
  secondaryButton: getFormButtonClasses('secondary'),
  
  // Contenedores
  form: forms.container.base,
  formCard: forms.container.card,
  fieldGroup: forms.fieldGroup.base,
  
  // Validación
  errorMessage: getValidationClasses('error'),
  successMessage: getValidationClasses('success'),
  
  // Elementos especiales
  searchInput: `${forms.special.search.container} ${forms.special.search.input}`,
  fileInput: forms.special.file.container,
  
  // Checkboxes y radios
  checkbox: forms.checkbox.base,
  radio: forms.radio.base
};

// Tipos para TypeScript
export type InputSize = keyof typeof forms.input.size;
export type InputState = keyof typeof forms.input.state;
export type InputVariant = keyof typeof forms.input.variant;
export type LabelSize = keyof typeof forms.label.size;
export type LabelState = keyof typeof forms.label.state;
export type LabelVariant = keyof typeof forms.label.variant;
export type ValidationMessage = keyof typeof forms.validation.message;
export type FormButtonType = keyof typeof forms.button;