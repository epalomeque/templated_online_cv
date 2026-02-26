import { Middleware, UnknownAction } from '@reduxjs/toolkit';
import { setError } from './cvSlice';

/**
 * Middleware para el manejo centralizado de errores.
 * Captura acciones que contienen errores o fallos y despacha una acción de error global.
 */
export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  // Verificar si la acción es un error (patrón común en Redux Toolkit / Async Thunks)
  if (isErrorAction(action as UnknownAction)) {
    const errorMessage = (action as { error?: { message?: string } }).error?.message || 'Ha ocurrido un error inesperado';
    console.error('Captured by Error Middleware:', errorMessage);
    store.dispatch(setError(errorMessage));
  }

  return next(action);
};

function isErrorAction(action: UnknownAction): action is { error: { message: string } } {
  return action.type.endsWith('/rejected') || (action.payload instanceof Error);
}
