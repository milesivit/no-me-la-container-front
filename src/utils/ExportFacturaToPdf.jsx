import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportFacturaToPDF = (reserva, user) => {
  const factura = reserva?.Facturas?.[0];
  const pago = factura?.Pagos?.[0];  // monto correcto
  const viaje = reserva?.viajesContainer?.viajes;
  const container = reserva?.viajesContainer?.containers;
  const cliente = reserva?.clientes;
  const usuario = cliente?.usuarios; // nombre del usuario dueño del cliente

  const pdf = new jsPDF({
    unit: "pt",
    format: "a4",
    compress: true,
  });

  const colorPrimary = [0, 159, 212];

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("es-AR");
  };

  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(26);
  pdf.setTextColor(...colorPrimary);
  pdf.text("FACTURA", 40, 60);

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont("Helvetica", "normal");

  pdf.text(`Factura Nº: ${factura?.numeroFactura ?? "—"}`, 40, 110);
  pdf.text(`Fecha de Emisión: ${formatDate(factura?.fechaEmision)}`, 40, 130);
  pdf.text(`Fecha de Reserva: ${formatDate(reserva?.fechaReserva)}`, 40, 150);

  // Cliente real (usuario + cuil del cliente)
  pdf.text(
    `Cliente: ${usuario?.nombre ?? user?.nombre ?? "—"} — CUIL: ${cliente?.cuil ?? ""}`,
    40,
    170
  );

  pdf.setDrawColor(...colorPrimary);
  pdf.setLineWidth(1);
  pdf.line(40, 190, 560, 190);

  pdf.setFontSize(18);
  pdf.setFont("Helvetica", "bold");
  pdf.setTextColor(...colorPrimary);
  pdf.text("Detalle de la Reserva", 40, 225);

  const detalle = [
    ["Reserva ID", reserva.id],
    ["Container", container?.codigo ?? "—"],
    ["Barco", viaje?.barcos?.nombre ?? "—"],
    ["Puerto Origen", viaje?.puertoOrigen?.nombre ?? "—"],
    ["Puerto Destino", viaje?.puertoDestino?.nombre ?? "—"],
    ["Entrega Estimada", formatDate(viaje?.promesaDeEntrega)],
  ];

  autoTable(pdf, {
    startY: 250,
    head: [["Campo", "Valor"]],
    body: detalle,
    theme: "grid",
    headStyles: {
      fillColor: colorPrimary,
      textColor: "#fff",
      halign: "center",
    },
    styles: {
      fontSize: 11,
    },
    columnStyles: {
      0: { cellWidth: 200 },
      1: { cellWidth: 260 },
    },
    margin: { left: 40, right: 40 },
  });

  const y = pdf.lastAutoTable.finalY + 40;

  pdf.setFontSize(18);
  pdf.setFont("Helvetica", "bold");
  pdf.setTextColor(...colorPrimary);
  pdf.text("Monto Total", 40, y);

  autoTable(pdf, {
    startY: y + 15,
    head: [["Descripción", "Monto"]],
    body: [
      [
        "Servicio de Transporte",
        `$${(pago?.monto ?? 0).toLocaleString("es-AR")}`,
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: colorPrimary,
      textColor: "#fff",
      halign: "center",
    },
    styles: {
      fontSize: 11,
    },
    columnStyles: {
      0: { cellWidth: 300 },
      1: { cellWidth: 160, halign: "right" },
    },
    margin: { left: 40, right: 40 },
  });

  pdf.save(`Factura_${factura?.numeroFactura ?? reserva.id}.pdf`);
};

export default exportFacturaToPDF;
