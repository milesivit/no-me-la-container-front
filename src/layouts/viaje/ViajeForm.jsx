import React, { useContext, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { ViajeContext } from "../../context/ViajeContext";
import { BarcoContext } from "../../context/BarcoContext";
import { PuertoContext } from "../../context/PuertoContext";
import { ViajeEstadoContext } from "../../context/ViajeEstadoContext";

import { useNavigate } from "react-router-dom";
import "./Viaje.css";
import "primeicons/primeicons.css";

const ViajeForm = () => {
  const { viajes, fetchViajes, deleteViaje, updateViaje, loading } =
    useContext(ViajeContext);

  const { puertos } = useContext(PuertoContext);
  const { viajeEstados } = useContext(ViajeEstadoContext);
  const { barcos } = useContext(BarcoContext);

  const toast = useRef(null);
  const dt = useRef(null);
  const navigate = useNavigate();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedViaje, setSelectedViaje] = useState(null);

  const [formValues, setFormValues] = useState({
    puertoOrigenId: "",
    puertoDestinoId: "",
    fechaSalida: "",
    promesaDeEntrega: "",
    viajeEstadoID: "",
    barco: "",
  });

  useEffect(() => {
    fetchViajes();
  }, []);

  const openEditModal = (viaje) => {
    setSelectedViaje(viaje);
    setFormValues({
      puertoOrigenId: viaje.puertoOrigenId || "",
      puertoDestinoId: viaje.puertoDestinoId || "",
      fechaSalida: viaje.fechaSalida?.split("T")[0] || "",
      promesaDeEntrega: viaje.promesaDeEntrega?.split("T")[0] || "",
      viajeEstadoID: viaje.viajeEstadoID || "",
      barco: viaje.barco || "",
    });
    setEditModalVisible(true);
  };

  const handleSave = async () => {
    await updateViaje(selectedViaje.id, formValues);
    toast.current.show({
      severity: "success",
      summary: "Actualizado",
      detail: "Viaje actualizado con éxito",
      life: 3000,
    });
    setEditModalVisible(false);
  };

  const handleDelete = async (id) => {
    await deleteViaje(id);
    toast.current.show({
      severity: "success",
      summary: "Eliminado",
      detail: "Viaje eliminado con éxito",
      life: 3000,
    });
  };

  const confirmDelete = (viaje) => {
    confirmDialog({
      message: `¿Está seguro que desea eliminar el viaje #${viaje.id}?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí",
      rejectLabel: "No",
      acceptClassName: "p-button-success",
      rejectClassName: "p-button-secondary",
      accept: () => handleDelete(viaje.id),
    });
  };

  const actionBodyTemplate = (rowData) => (
    <div className="viaje-action-buttons">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-info p-button-sm"
        onClick={() => openEditModal(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-sm"
        onClick={() => confirmDelete(rowData)}
      />
    </div>
  );

  const headerTemplate = (
    <div className="viaje-header">
      <h1 className="viaje-title">Lista de Viajes</h1>

      <div className="viaje-header-actions">
        <Button
          label="Crear Viaje"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={() => navigate("/viaje/crear")}
        />
        <Button
          type="button"
          icon="pi pi-file"
          rounded
          tooltip="Exportar"
          tooltipOptions={{ position: "top" }}
          onClick={() => dt.current.exportCSV()}
        />
      </div>
    </div>
  );

  return (
    <div className="viaje-page">
      <div className="viaje-page-container">
        <Toast ref={toast} />
        <ConfirmDialog />

        {loading ? (
          <p>Cargando viajes...</p>
        ) : viajes.length === 0 ? (
          <p>No hay viajes registrados.</p>
        ) : (
          <div className="viaje-table-wrapper">
            <DataTable
              ref={dt}
              value={viajes}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No hay viajes registrados."
              className="viaje-table"
              header={headerTemplate}
            >
              <Column field="puertoOrigen.nombre" header="Origen" sortable />
              <Column field="puertoDestino.nombre" header="Destino" sortable />
              <Column field="fechaSalida" header="Salida" sortable />
              <Column field="promesaDeEntrega" header="Llegada" sortable />
              <Column field="viajeEstado.nombre" header="Estado" sortable />
              <Column field="barcos.nombre" header="Barco" sortable />
              <Column body={actionBodyTemplate} header="Acciones" exportable={false} />
            </DataTable>
          </div>
        )}

        {/* MODAL EDITAR */}
        <Dialog
          header="Editar Viaje"
          visible={editModalVisible}
          modal
          className="viaje-modal"
          onHide={() => setEditModalVisible(false)}
          footer={
            <div className="flex justify-end gap-2 mt-4">
              <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setEditModalVisible(false)} />
              <Button label="Guardar" icon="pi pi-check" className="p-button-success" onClick={handleSave} />
            </div>
          }
        >
          <div className="viaje-modal-form">

            {/* ORIGEN */}
            <div className="viaje-form-group">
              <label>Origen</label>
              <Dropdown
                value={formValues.puertoOrigenId}
                options={puertos.map(p => ({ label: p.nombre, value: p.id }))}
                onChange={(e) =>
                  setFormValues({ ...formValues, puertoOrigenId: e.value })
                }
                placeholder="Seleccione un puerto"
                filter
              />
            </div>

            {/* DESTINO */}
            <div className="viaje-form-group">
              <label>Destino</label>
              <Dropdown
                value={formValues.puertoDestinoId}
                options={puertos.map(p => ({ label: p.nombre, value: p.id }))}
                onChange={(e) =>
                  setFormValues({ ...formValues, puertoDestinoId: e.value })
                }
                placeholder="Seleccione un puerto"
                filter
              />
            </div>

            {/* FECHAS */}
            <div className="viaje-form-group">
              <label>Fecha salida</label>
              <InputText
                type="date"
                name="fechaSalida"
                value={formValues.fechaSalida}
                onChange={(e) =>
                  setFormValues({ ...formValues, fechaSalida: e.target.value })
                }
              />
            </div>

            <div className="viaje-form-group">
              <label>Fecha llegada</label>
              <InputText
                type="date"
                name="promesaDeEntrega"
                value={formValues.promesaDeEntrega}
                onChange={(e) =>
                  setFormValues({ ...formValues, promesaDeEntrega: e.target.value })
                }
              />
            </div>

            {/* ESTADO */}
            <div className="viaje-form-group">
              <label>Estado del viaje</label>
              <Dropdown
                value={formValues.viajeEstadoID}
                options={viajeEstados.map(es => ({
                  label: es.nombre,
                  value: es.id
                }))}
                onChange={(e) =>
                  setFormValues({ ...formValues, viajeEstadoID: e.value })
                }
                placeholder="Seleccione estado"
                filter
              />
            </div>

            {/* BARCO */}
            <div className="viaje-form-group">
              <label>Barco</label>
              <Dropdown
                value={formValues.barco}
                options={barcos.map(b => ({
                  label: b.nombre,
                  value: b.id
                }))}
                onChange={(e) =>
                  setFormValues({ ...formValues, barco: e.value })
                }
                placeholder="Seleccione barco"
                filter
              />
            </div>

          </div>
        </Dialog>

      </div>
    </div>
  );
};

export default ViajeForm;
