import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { colors } from '@/shared/styles/colors';
import React, { useState } from 'react';

import { Send, CheckCircle2, AlertCircle } from '@/lib/icons';
import { User, Mail, Phone, MessageSquare, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ButtonPrincipal from '@/shared/components/ButtonPrincipal';
import { WHATSAPP_REDIRECT } from '@/shared/constants/infoBusiness';

// Interfaces
interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

interface TouchedFields {
  name?: boolean;
  email?: boolean;
  phone?: boolean;
  subject?: boolean;
  message?: boolean;
}

export default function ContactFormBusiness() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  const validateField = (name: keyof FormData, value: string) => {
    const newErrors = { ...errors };
    let isValid = true;

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'El nombre es requerido';
          isValid = false;
        } else if (value.trim().length < 2) {
          newErrors.name = 'El nombre debe tener al menos 2 caracteres';
          isValid = false;
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'El email es requerido';
          isValid = false;
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Ingresa un email válido';
          isValid = false;
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        const phoneRegex = /^[+]?[0-9\s\-()]{9,15}$/;
        if (value && !phoneRegex.test(value)) {
          newErrors.phone = 'Ingresa un teléfono válido';
          isValid = false;
        } else {
          delete newErrors.phone;
        }
        break;
      case 'subject':
        if (!value) {
          newErrors.subject = 'Selecciona un asunto';
          isValid = false;
        } else {
          delete newErrors.subject;
        }
        break;
      case 'message':
        if (!value.trim()) {
          newErrors.message = 'El mensaje es requerido';
          isValid = false;
        } else if (value.trim().length < 10) {
          newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
          isValid = false;
        } else if (value.length > 500) {
          newErrors.message = 'El mensaje no puede exceder 500 caracteres';
          isValid = false;
        } else {
          delete newErrors.message;
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (touched[name as keyof TouchedFields]) {
      validateField(name as keyof FormData, value);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name as keyof FormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Validar todos los campos
    const fieldsToValidate: (keyof FormData)[] = [
      'name',
      'email',
      'phone',
      'subject',
      'message',
    ];
    let isFormValid = true;

    fieldsToValidate.forEach((field) => {
      const isValid = validateField(field, formData[field]);
      if (!isValid) isFormValid = false;
      setTouched((prev) => ({ ...prev, [field]: true }));
    });

    if (!isFormValid) {
        setIsSubmitting(false);
        return;
    }

    try {
      // Simular envío
      await new Promise((resolve) => setTimeout(resolve, 1000));

      window.open(
        `${WHATSAPP_REDIRECT}?text=Hola soy ${formData.name}, me interesa ${formData.subject}. ${formData.message}. Mi contacto: ${formData.phone} / ${formData.email}`,
        '_blank'
      );

      setSubmitMessage('Mensaje listo para enviar por WhatsApp.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTouched({});
      setErrors({});
    } catch {
        setSubmitMessage('Error al preparar el mensaje.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-neutral-100 dark:border-white/10 p-8 sm:p-10 h-full">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Envíanos un mensaje</h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Estamos listos para hacer realidad tu proyecto. Cuéntanos qué necesitas.
        </p>
      </div>

      {submitMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p className="font-medium">{submitMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          {/* Nombre */}
          <div className="relative group">
            <div className="absolute left-3 top-3 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                <User className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={cn(
                "w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border rounded-xl transition-all outline-none",
                errors.name && touched.name
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              )}
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Email y Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="relative group">
                <div className="absolute left-3 top-3 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                    <Mail className="h-5 w-5" />
                </div>
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={cn(
                  "w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border rounded-xl transition-all outline-none",
                  errors.email && touched.email
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                )}
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.email}
                </p>
              )}
            </div>

            <div className="relative group">
                <div className="absolute left-3 top-3 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                    <Phone className="h-5 w-5" />
                </div>
              <input
                type="tel"
                name="phone"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={cn(
                  "w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border rounded-xl transition-all outline-none",
                  errors.phone && touched.phone
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                )}
              />
              {errors.phone && touched.phone && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Asunto */}
          <div className="relative group">
            <div className="absolute left-3 top-3 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                <Tag className="h-5 w-5" />
            </div>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              className={cn(
                "w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border rounded-xl transition-all outline-none appearance-none",
                errors.subject && touched.subject
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              )}
            >
              <option value="" disabled>Selecciona un asunto</option>
              <option value="cotizacion">Solicitar cotización</option>
              <option value="informacion">Información general</option>
              <option value="soporte">Soporte técnico</option>
              <option value="otro">Otro</option>
            </select>
             <div className="absolute right-3 top-3 pointer-events-none text-neutral-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            {errors.subject && touched.subject && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.subject}
              </p>
            )}
          </div>

          {/* Mensaje */}
          <div className="relative group">
            <div className="absolute left-3 top-3 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                <MessageSquare className="h-5 w-5" />
            </div>
            <textarea
              name="message"
              placeholder="¿Cómo podemos ayudarte? Cuéntanos sobre tu proyecto..."
              rows={5}
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              className={cn(
                "w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border rounded-xl transition-all outline-none resize-none",
                errors.message && touched.message
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              )}
            />
            {errors.message && touched.message && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.message}
              </p>
            )}
          </div>
        </div>

        <ButtonPrincipal
          type="submit"
          className="w-full py-4 text-lg font-semibold shadow-lg hover:shadow-primary-500/25"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          msgLoading="Enviando..."
          icon={<Send className="h-5 w-5" />}
          msgLg="Enviar Mensaje"
        />
      </form>
    </div>
  );
}