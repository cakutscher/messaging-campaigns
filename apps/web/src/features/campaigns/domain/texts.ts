export const texts = {
  dashboard: {
    title: 'Dashboard Campañas',
  },
  button: 'Crear Campaña',
  form: {
    title: 'Crear Campaña',
    nameLabel: 'Nombre',
    contentLabel: 'Contenido a enviar',
    contentPlaceholder: 'Redacta aquí el mensaje para la campaña...',
    createButton: 'Crear',
    creatingButton: 'Creando...',
    submitError: 'Ocurrió un error al crear la campaña. Por favor, inténtalo de nuevo.',
  },
  list: {
    title: 'Campañas',
    empty: 'Aún no hay campañas. Crea una en el formulario.',
    created: 'Creada:',
    selectLabel: 'Seleccionar campaña',
    idTitle: 'ID de la campaña',
  },
  detail: {
    title: 'Detalle de la Campaña',
    empty: 'Selecciona una campaña para ver los detalles.',
    created: 'Creada:',
    executeButton: 'Ejecutar',
    cancelButton: 'Cancelar',
  },
  recipients: {
    title: 'Subir Destinatarios (CSV)',
    selectFile: 'Cargar archivo',
    selectedFile: 'Archivo seleccionado:',
    parsedInfo: (count: number) => `Analizados ${count} destinatario(s)`,
    errorsTitle: 'Errores de validación:',
    errorLine: (line: number, message: string) => `Línea ${line}: ${message}`,
    previewTitle: 'Vista previa',
    importButton: 'Importar a la campaña',
  },
  monitor: {
    title: 'Monitor de Envío',
    empty: 'Aún no se han subido destinatarios.',
    status: {
      sent: 'Enviado',
      pending: 'Pendiente',
      error: 'Error',
    },
    tooltip: (r: { name: string; phone: string; channel: string; errorMessage?: string | null }) =>
      `Nombre: ${r.name}\nTeléfono: ${r.phone}\nCanal: ${r.channel}${
        r.errorMessage ? `\nError: ${r.errorMessage}` : ''
      }`,
  },
  table: {
    name: 'Nombre',
    phone: 'Teléfono',
    channel: 'Canal',
    status: 'Estado',
  },
};

export type Texts = typeof texts;
