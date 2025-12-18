export const texts = {
  dashboard: {
    title: 'Panel de Campañas',
  },
  form: {
    title: 'Crear Campaña',
    nameLabel: 'Nombre',
    contentLabel: 'Contenido del Mensaje',
    contentPlaceholder: 'Redacta aquí el mensaje para la campaña...',
    createButton: 'Crear',
    creatingButton: 'Creando...',
    submitError:
      'Ocurrió un error al crear la campaña. Por favor, inténtalo de nuevo.',
  },
  list: {
    title: 'Campañas',
    empty: 'Aún no hay campañas. Crea una en el formulario.',
    created: 'Creada:',
    selectLabel: 'Seleccionar campaña',
    idTitle: 'ID de la campaña',
    viewMoreButton: 'Ver más',
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
    selectedFile: 'Archivo seleccionado:',
    parsedInfo: (count: number) => `Analizados ${count} destinatario(s)`,
    errorsInfo: (count: number) => `• ${count} error(es)`,
    noErrorsInfo: '• sin errores',
    errorsTitle: 'Errores de validación:',
    errorLine: (line: number, message: string) => `Línea ${line}: ${message}`,
    showingErrors: (count: number) =>
      `Mostrando los primeros ${count} errores.`,
    previewTitle: (count: number) => `Vista previa (primeras ${count} filas):`,
    importButton: 'Importar a la campaña',
  },
  monitor: {
    title: 'Monitor de Envío',
    empty: 'Aún no se han subido destinatarios.',
    legend: 'Leyenda:',
    status: {
      sent: 'Enviado',
      pending: 'Pendiente',
      error: 'Error',
    },
    tooltip: (r: {
      name: string;
      phone: string;
      channel: string;
      errorMessage?: string | null;
    }) =>
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
