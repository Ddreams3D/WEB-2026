import React, { useState } from 'react';

import { Send, CheckCircle2, AlertCircle } from '@/lib/icons';
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

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'El nombre es requerido';
        } else if (value.trim().length < 2) {
          newErrors.name = 'El nombre debe tener al menos 2 caracteres';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'El email es requerido';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Ingresa un email válido';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        const phoneRegex = /^[+]?[0-9\s\-()]{9,15}$/;
        if (value && !phoneRegex.test(value)) {
          newErrors.phone = 'Ingresa un teléfono válido';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'subject':
        if (!value) {
          newErrors.subject = 'Selecciona un asunto';
        } else {
          delete newErrors.subject;
        }
        break;
      case 'message':
        if (!value.trim()) {
          newErrors.message = 'El mensaje es requerido';
        } else if (value.trim().length < 10) {
          newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
        } else if (value.length > 500) {
          newErrors.message = 'El mensaje no puede exceder 500 caracteres';
        } else {
          delete newErrors.message;
        }
        break;
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name as keyof FormData]) {
      validateField(name as keyof FormData, value);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name as keyof FormData, value);
  };

  const getFieldStatus = (fieldName: keyof FormData) => {
    if (!touched[fieldName]) return null;
    return errors[fieldName] ? 'error' : 'success';
  };

  const getFieldIcon = (fieldName: keyof FormData) => {
    const status = getFieldStatus(fieldName);
    if (status === 'error')
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (status === 'success')
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      setSubmitMessage('Por favor, corrige los errores en el formulario.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Simular envío del formulario
      await new Promise((resolve) => setTimeout(resolve, 1000));

      window.open(
        `${WHATSAPP_REDIRECT}?text=Hola ${formData.name}, me interesa ${formData.subject}, ${formData.message}, contactame a este numero ${formData.phone} o al email ${formData.email}`,
        '_blank'
      );

      setSubmitMessage(
        'Mensaje enviado correctamente. Te contactaremos pronto.'
      );
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
      setSubmitMessage('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="contact-form">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-neutral-200/50 dark:border-neutral-700/50">
        <header className="mb-6 sm:mb-8">
          <h2
            id="contact-form"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"
          >
            Envíanos un Mensaje
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Completa el formulario y te responderemos a la brevedad
          </p>
        </header>

        {submitMessage && (
          <div
            className={`mb-4 p-4 rounded-lg shadow-md ${
              submitMessage.includes('Error')
                ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30'
                : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30'
            }`}
            role="alert"
            aria-live="polite"
          >
            {submitMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1 sm:mb-2 text-neutral-700 dark:text-neutral-300"
              >
                Nombre *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  aria-required="true"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-300 ${
                    getFieldStatus('name') === 'error'
                      ? 'border-red-500 focus:border-red-500'
                      : getFieldStatus('name') === 'success'
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-400'
                  }`}
                  placeholder="Tu nombre completo"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {getFieldIcon('name')}
                </div>
              </div>
              {errors.name && touched.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 sm:mb-2 text-neutral-700 dark:text-neutral-300"
              >
                Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  aria-required="true"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-300 ${
                    getFieldStatus('email') === 'error'
                      ? 'border-red-500 focus:border-red-500'
                      : getFieldStatus('email') === 'success'
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-400'
                  }`}
                  placeholder="tu@email.com"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {getFieldIcon('email')}
                </div>
              </div>
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-1 sm:mb-2 text-neutral-700 dark:text-neutral-300"
              >
                Teléfono
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-300 ${
                    getFieldStatus('phone') === 'error'
                      ? 'border-red-500 focus:border-red-500'
                      : getFieldStatus('phone') === 'success'
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-400'
                  }`}
                  placeholder="+51 901 843 288"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {getFieldIcon('phone')}
                </div>
              </div>
              {errors.phone && touched.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.phone}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium mb-1 sm:mb-2 text-neutral-700 dark:text-neutral-300"
              >
                Asunto *
              </label>
              <div className="relative">
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-300 ${
                    getFieldStatus('subject') === 'error'
                      ? 'border-red-500 focus:border-red-500'
                      : getFieldStatus('subject') === 'success'
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-400'
                  }`}
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="cotizacion">Solicitar Cotización</option>
                  <option value="consulta">Consulta General</option>
                  <option value="soporte">Soporte Técnico</option>
                  <option value="colaboracion">Colaboración</option>
                  <option value="otro">Otro</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-8 flex items-center">
                  {getFieldIcon('subject')}
                </div>
              </div>
              {errors.subject && touched.subject && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.subject}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-1 sm:mb-2 text-neutral-700 dark:text-neutral-300"
            >
              Mensaje *
            </label>
            <div className="relative">
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                rows={4}
                maxLength={500}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-700 dark:text-white transition-all duration-300 resize-none sm:rows-6 ${
                  getFieldStatus('message') === 'error'
                    ? 'border-red-500 focus:border-red-500'
                    : getFieldStatus('message') === 'success'
                    ? 'border-green-500 focus:border-green-500'
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-400'
                }`}
                placeholder="Describe tu proyecto o consulta..."
              />
              <div className="absolute top-2 right-2">
                {getFieldIcon('message')}
              </div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div>
                {errors.message && touched.message && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>
              <p
                className={`text-xs ${
                  formData.message.length > 450
                    ? 'text-red-500'
                    : formData.message.length > 400
                    ? 'text-yellow-500'
                    : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {formData.message.length}/500
              </p>
            </div>
          </div>
          <ButtonPrincipal
            type="submit"
            disabled={isSubmitting}
            aria-describedby={isSubmitting ? 'sending-message' : undefined}
            isLoading={isSubmitting}
            isFull
            msgLoading="Enviando"
            msgSm="Enviar"
            msgLg="Enviar Mensaje"
            icon={
              <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" aria-hidden="true" />
            }
          />
        </form>
      </div>
    </section>
  );
}
